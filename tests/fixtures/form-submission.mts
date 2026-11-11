import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { POST as contact } from "../../src/app/api/contact/route";
import { POST as application } from "../../src/app/api/job-application/route";
import { POST as enquiry } from "../../src/app/api/reques-for-quote/route";
import { recaptchaActions } from "../../src/lib/recaptcha/actions";
import { submitForm, FormSubmitError } from "../../src/lib/forms/submit";
import {
  readFormRequest,
  MAX_FORM_REQUEST_BYTES,
} from "../../src/lib/forms/http";
import { publicFormsEnabled } from "../../src/lib/forms/availability";
import {
  getPublicFormHref,
  getLegacyFormRedirect,
} from "../../src/lib/forms/navigation";

test("enabling forms restores original links and disables temporary redirects", () => {
  assert.equal(publicFormsEnabled, true);
  for (const locale of ["cs", "en", "de", "fi", "pl"] as const) {
    assert.equal(
      getPublicFormHref(locale, "/#reques-for-quote", "/"),
      "#reques-for-quote",
    );
    assert.equal(
      getPublicFormHref(locale, "/#reques-for-quote", "/about"),
      `/${locale}/#reques-for-quote`,
    );
    assert.equal(
      getPublicFormHref(locale, "/contact#contact-form", "/about"),
      `/${locale}/contact#contact-form`,
    );
    assert.equal(
      getPublicFormHref(locale, "/contact#contact-form", "/contact"),
      "#contact-form",
    );
    assert.equal(
      getPublicFormHref(locale, "/jobs/buyer#job-application", "/jobs/buyer"),
      "#job-application",
    );
    assert.equal(
      getLegacyFormRedirect(
        new URL(`https://hokami.cz/${locale}#reques-for-quote`),
        locale,
        "/#reques-for-quote",
      ),
      null,
    );
  }
});

const contactValues = {
  name: " Jana Nováková ",
  email: " jana@example.cz ",
  phone: "",
  message: " Dotaz z webu. ",
};
const jobValues = {
  name: "Jana Nováková",
  email: "jana@example.cz",
  phone: "+420 123 456 789",
  job: "buyer",
  start: "Ihned",
  message: "Mám zájem o tuto pozici.",
};
const enquiryValues = {
  name: "Jana Nováková",
  company: "Example s.r.o.",
  email: "jana@example.cz",
  country: "",
  industry: "",
  volume: "",
  project: "",
};

function formRequest(
  values: unknown,
  files: File[] = [],
  locale = "cs",
  origin = "https://hokami.cz",
) {
  const body = new FormData();
  body.set("values", JSON.stringify(values));
  body.set("locale", locale);
  body.set("recaptchaToken", "test-token");
  for (const file of files) body.append("files", file);
  return new Request("https://hokami.cz/api/form", {
    method: "POST",
    headers: { Origin: origin },
    body,
  });
}

function environment(
  t: TestContext,
  overrides: Record<string, string | undefined> = {},
) {
  const values = {
    MAILTRAP_API_TOKEN: "test-only-token",
    MAILTRAP_FROM_EMAIL: "info@hokami.cz",
    FORMS_TO_EMAIL: "info@hokami.cz",
    RECAPTCHA_SECRET_KEY: "test-only-secret",
    RECAPTCHA_ALLOWED_HOSTNAMES: "hokami.cz",
    RECAPTCHA_MIN_SCORE: "0.5",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) {
    const previous = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }
}

function captcha(action: string) {
  return {
    success: true,
    score: 0.9,
    action,
    hostname: "hokami.cz",
    challenge_ts: new Date().toISOString(),
  };
}

test("all three forms verify their own action and send to the configured recipient with Reply-To", async (t) => {
  environment(t);
  let action: string = recaptchaActions.contact;
  const messages: Record<string, unknown>[] = [];
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (url: unknown, init?: RequestInit) => {
      if (url === "https://www.recaptcha.net/recaptcha/api/siteverify") {
        assert.equal(
          new URLSearchParams(init?.body as URLSearchParams).get("response"),
          "test-token",
        );
        return Response.json(captcha(action));
      }
      assert.equal(url, "https://send.api.mailtrap.io/api/send");
      assert.equal(
        new Headers(init?.headers).get("authorization"),
        "Bearer test-only-token",
      );
      messages.push(JSON.parse(String(init?.body)));
      return Response.json({ success: true, message_ids: ["test-id"] });
    },
  );
  for (const [handler, values, expectedAction] of [
    [contact, contactValues, recaptchaActions.contact],
    [application, jobValues, recaptchaActions.jobApplication],
    [enquiry, enquiryValues, recaptchaActions.enquiry],
  ] as const) {
    action = expectedAction;
    const response = await handler(
      formRequest({ ...values, to: "attacker@example.com" }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal(fetchMock.mock.callCount(), 6);
  assert.equal(messages.length, 3);
  for (const message of messages) {
    assert.deepEqual(message.to, [{ email: "info@hokami.cz" }]);
    assert.deepEqual(message.from, { email: "info@hokami.cz", name: "HOKAMI" });
    assert.deepEqual(message.reply_to, {
      email: "jana@example.cz",
      name: "Jana Nováková",
    });
    assert.ok(!String(message.text).includes("test-token"));
  }
  assert.match(String(messages[0].text), /Zpráva:\nDotaz z webu\./);
  assert.match(String(messages[1].text), /Pozice: buyer/);
});

test("uploaded files reach Mailtrap intact, without trusting client file metadata", async (t) => {
  environment(t);
  const bytes = new Uint8Array([0, 1, 128, 255]);
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (url: unknown, init?: RequestInit) => {
      if (String(url).includes("siteverify"))
        return Response.json(captcha(recaptchaActions.enquiry));
      const message = JSON.parse(String(init?.body));
      assert.equal(message.attachments.length, 1);
      assert.equal(message.attachments[0].filename, "data.zip");
      assert.equal(message.attachments[0].type, "application/zip");
      assert.equal(message.attachments[0].disposition, "attachment");
      assert.deepEqual(
        Buffer.from(message.attachments[0].content, "base64"),
        Buffer.from(bytes),
      );
      return Response.json({ success: true });
    },
  );
  const response = await enquiry(
    formRequest(enquiryValues, [
      new File([bytes], "data.zip", { type: "application/zip" }),
    ]),
  );
  assert.equal(response.status, 200);
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("server field validation, locale and current vacancy availability run before external services", async (t) => {
  environment(t);
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("External services must not be called");
  });
  const invalidContact = await contact(
    formRequest({
      ...contactValues,
      name: " ",
      email: "invalid",
      message: " ",
    }),
  );
  assert.equal(invalidContact.status, 400);
  assert.deepEqual((await invalidContact.json()).fields, {
    name: "nameRequired",
    email: "emailInvalid",
    message: "messageRequired",
  });
  for (const job of ["nonexistent-vacancy", "../buyer"]) {
    const invalidJob = await application(formRequest({ ...jobValues, job }));
    assert.equal(invalidJob.status, 400);
    assert.deepEqual((await invalidJob.json()).fields, { job: "jobInvalid" });
  }
  assert.equal(
    (await application(formRequest(jobValues, [], "unknown"))).status,
    400,
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("both attachment forms enforce aggregate 4 MB, formats, counts and nonempty content on the server", async (t) => {
  environment(t);
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected external request");
  });
  const files = [
    new File([new Uint8Array(2_000_000)], "first.pdf", {
      type: "application/pdf",
    }),
    new File([new Uint8Array(2_000_001)], "second.pdf", {
      type: "application/pdf",
    }),
  ];
  for (const [handler, values, error] of [
    [enquiry, enquiryValues, "filesSize"],
    [application, jobValues, "filesTooLarge"],
  ] as const) {
    const response = await handler(formRequest(values, files));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).fileError, error);
  }
  for (const [file, error] of [
    [new File(["text"], "cv.exe"), "fileFormat"],
    [new File([], "cv.pdf"), "fileEmpty"],
  ] as const) {
    const response = await application(formRequest(jobValues, [file]));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).fileError, error);
  }
  const tooMany = await enquiry(
    formRequest(
      enquiryValues,
      Array.from({ length: 11 }, (_, i) => new File(["x"], `${i}.zip`)),
    ),
  );
  assert.equal((await tooMany.json()).fileError, "filesCount");
  assert.equal(
    (await contact(formRequest(contactValues, [new File(["x"], "data.txt")])))
      .status,
    400,
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("tokens from another form never authorize delivery", async (t) => {
  environment(t);
  const fetchMock = t.mock.method(globalThis, "fetch", async (url: unknown) => {
    assert.ok(String(url).includes("siteverify"));
    return Response.json(captcha(recaptchaActions.enquiry));
  });
  for (const [handler, values] of [
    [contact, contactValues],
    [application, jobValues],
  ] as const) {
    const response = await handler(formRequest(values));
    assert.equal(response.status, 403);
    assert.equal((await response.json()).error, "captcha");
  }
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("missing configuration never sends mail, and provider failures never claim success", async (t) => {
  environment(t, { MAILTRAP_API_TOKEN: undefined });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected external request");
  });
  assert.equal((await contact(formRequest(contactValues))).status, 503);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("reCAPTCHA outage and Mailtrap rejection return useful errors without leaking provider output", async (t) => {
  environment(t);
  t.mock.method(console, "error", () => {});
  let captchaAvailable = false;
  let mailResponse = Response.json({
    success: false,
    errors: ["private provider details"],
  });
  t.mock.method(globalThis, "fetch", async (url: unknown) => {
    if (String(url).includes("siteverify")) {
      if (!captchaAvailable) throw new Error("Network failure");
      return Response.json(captcha(recaptchaActions.contact));
    }
    return mailResponse;
  });
  const outage = await contact(formRequest(contactValues));
  assert.equal(outage.status, 503);
  assert.deepEqual(await outage.json(), {
    success: false,
    error: "unavailable",
  });
  captchaAvailable = true;
  for (const response of [
    mailResponse,
    new Response("invalid gateway response", { status: 502 }),
  ]) {
    mailResponse = response;
    const rejection = await contact(formRequest(contactValues));
    assert.equal(rejection.status, 502);
    assert.deepEqual(await rejection.json(), { success: false, error: "send" });
  }
});

test("multipart parser rejects cross-origin, duplicate metadata, wrong types and oversized streamed bodies", async () => {
  await assert.rejects(
    readFormRequest(
      formRequest(contactValues, [], "cs", "https://evil.example"),
    ),
  );
  const form = new FormData();
  for (const [key, value] of [
    ["values", "{}"],
    ["locale", "cs"],
    ["locale", "en"],
    ["recaptchaToken", "test"],
  ])
    form.append(key, value);
  await assert.rejects(
    readFormRequest(
      new Request("https://hokami.cz/api/form", { method: "POST", body: form }),
    ),
  );
  await assert.rejects(
    readFormRequest(
      new Request("https://hokami.cz/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
    ),
  );
  const oversized = new Request("https://hokami.cz/api/form", {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data; boundary=test" },
    body: "x".repeat(MAX_FORM_REQUEST_BYTES + 1),
  });
  await assert.rejects(readFormRequest(oversized), /Request too large/);
  const parsed = await readFormRequest(formRequest(contactValues));
  assert.deepEqual(parsed.input.values, contactValues);
  assert.deepEqual(parsed.files, []);
});

test("client submission accepts the SDK's non-native thenable and sends fresh action tokens and actual files", async (t) => {
  environment(t);
  let action = "";
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      setTimeout(callback: () => void, delay: number) {
        const timer = setTimeout(callback, delay);
        timer.unref();
        return timer;
      },
      clearTimeout,
      grecaptcha: {
        ready: (callback: () => void) => callback(),
        execute: (_key: string, options: { action: string }) => {
          action = options.action;
          return sdkThenable(Promise.resolve("test-token"));
        },
      },
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      createElement: () => ({ remove() {} }),
      head: {
        appendChild(script: { onload: () => void }) {
          queueMicrotask(() => script.onload());
        },
      },
    },
  });
  t.after(() => {
    for (const [key, descriptor] of [
      ["window", previousWindow],
      ["document", previousDocument],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  const handlers: Record<string, typeof contact> = {
    "/api/contact": contact,
    "/api/job-application": application,
    "/api/reques-for-quote": enquiry,
  };
  let sent = 0;
  let rejectCaptcha = false;
  t.mock.method(
    globalThis,
    "fetch",
    async (url: unknown, init?: RequestInit) => {
      const endpoint = String(url);
      if (handlers[endpoint]) {
        assert.ok(init?.body instanceof FormData);
        const headers = new Headers(init.headers);
        assert.equal(
          headers.has("content-type"),
          false,
          "the browser sets the multipart boundary",
        );
        headers.set("Origin", "https://hokami.cz");
        return handlers[endpoint](
          new Request(`https://hokami.cz${endpoint}`, { ...init, headers }),
        );
      }
      if (endpoint.includes("siteverify"))
        return Response.json(
          rejectCaptcha ? { ...captcha(action), score: 0 } : captcha(action),
        );
      assert.equal(endpoint, "https://send.api.mailtrap.io/api/send");
      const mail = JSON.parse(String(init?.body));
      if (mail.category === "Job application") {
        assert.equal(mail.attachments[0].filename, "cv.pdf");
        assert.equal(
          Buffer.from(mail.attachments[0].content, "base64").toString(),
          "%PDF-fixture",
        );
      }
      sent++;
      return Response.json({ success: true });
    },
  );
  for (const [endpoint, values, expectedAction, files] of [
    ["/api/contact", contactValues, recaptchaActions.contact, []],
    [
      "/api/job-application",
      jobValues,
      recaptchaActions.jobApplication,
      [new File(["%PDF-fixture"], "cv.pdf", { type: "application/pdf" })],
    ],
    ["/api/reques-for-quote", enquiryValues, recaptchaActions.enquiry, []],
  ] as const) {
    await submitForm({
      endpoint,
      values,
      locale: "cs",
      siteKey: "test-public-key",
      action: expectedAction,
      files: [...files],
    });
    assert.equal(action, expectedAction);
  }
  assert.equal(sent, 3);
  rejectCaptcha = true;
  await assert.rejects(
    submitForm({
      endpoint: "/api/contact",
      values: contactValues,
      locale: "cs",
      siteKey: "test-public-key",
      action: recaptchaActions.contact,
    }),
    (error) => error instanceof FormSubmitError && error.reason === "captcha",
  );
  assert.equal(sent, 3);
});

function sdkThenable<T>(promise: Promise<T>): PromiseLike<T> {
  return {
    then(onfulfilled, onrejected) {
      return sdkThenable(promise.then(onfulfilled, onrejected));
    },
  };
}
