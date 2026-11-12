import assert from "node:assert/strict";
import { test } from "node:test";
import { Window as TestWindow } from "happy-dom";
import * as CookieConsent from "vanilla-cookieconsent";
import { recaptchaActions } from "../src/lib/recaptcha/actions";
import type { FormAnalyticsEvent } from "../src/lib/analytics/google-tag-manager";
import type { FormSubmissionAnalytics } from "../src/lib/analytics/form-events";

test("real consent revisions and service choices gate successful form events and survive withdrawal", async (t) => {
  const view = new TestWindow({
    url: "https://www.hokami.cz/en",
    settings: {
      disableJavaScriptFileLoading: true,
      handleDisabledFileLoadingAsSuccess: true,
      enableJavaScriptEvaluation: true,
    },
  });
  const nativeView = view as unknown as Window;
  const globals = {
    window: view,
    self: view,
    document: view.document,
    navigator: view.navigator,
    location: view.location,
    HTMLElement: view.HTMLElement,
    Event: view.Event,
    CustomEvent: view.CustomEvent,
    getComputedStyle: view.getComputedStyle.bind(view),
    dispatchEvent: view.dispatchEvent.bind(view),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const descriptors = Object.fromEntries(
    Object.keys(globals).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const [key, value] of Object.entries(globals))
    Object.defineProperty(globalThis, key, { configurable: true, value });
  const environment = {
    NEXT_PUBLIC_GTM_ID: "GTM-TEST123",
    NEXT_PUBLIC_GA4_ID: "G-TEST456",
  };
  const previousEnvironment = new Map(
    Object.keys(environment).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, environment);
  const cleanup: (() => Promise<void>)[] = [];
  t.after(async () => {
    for (const dispose of cleanup) await dispose();
    CookieConsent.reset();
    for (const key of Object.keys(globals)) {
      const descriptor = descriptors[key];
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
    for (const [key, value] of previousEnvironment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await view.happyDOM.close();
  });

  const { createConsentConfig } =
    await import("../src/components/integrations/cookie-consent/config");
  const legacy = createConsentConfig("en");
  legacy.revision = 1;
  legacy.categories.analytics.services = {
    vercelAnalytics: { label: "Vercel Web Analytics" },
    speedInsights: { label: "Vercel Speed Insights" },
  };
  await CookieConsent.run(legacy);
  CookieConsent.acceptCategory("all");
  assert.equal(CookieConsent.validConsent(), true);
  CookieConsent.reset();

  const { initializeConsent } = await import("../src/lib/cookie-consent");
  await initializeConsent("en");
  assert.equal(
    CookieConsent.validConsent(),
    false,
    "old Vercel consent needs renewal",
  );
  assert.equal(view.document.scripts.length, 0);
  CookieConsent.acceptService("vercelAnalytics", "analytics");
  assert.equal(
    CookieConsent.acceptedService("googleAnalytics", "analytics"),
    false,
  );
  assert.equal(
    view.document.scripts.length,
    0,
    "Vercel-only consent never loads Google",
  );

  const { act, createElement } = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { SiteMeasurement } =
    await import("../src/components/integrations/analytics/site-measurement");
  const host = view.document.createElement("div");
  view.document.body.appendChild(host);
  const root = createRoot(host as unknown as HTMLElement);
  cleanup.push(async () => {
    await act(async () => root.unmount());
  });
  await act(async () => root.render(createElement(SiteMeasurement)));
  assert.equal(
    view.document.querySelectorAll('script[data-ntpc="GTM"]').length,
    0,
  );
  assert.equal(
    nativeView.dataLayer!.length,
    1,
    "only the denied default is queued before Google consent",
  );

  nativeView.grecaptcha = {
    ready: (callback) => callback(),
    execute: async () => "test-only-token",
  };
  const { submitForm, FormSubmitError } =
    await import("../src/lib/forms/submit");
  const { trackSuccessfulForm } =
    await import("../src/lib/analytics/form-events");
  let reply = Response.json({ success: true });
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    reply.clone(),
  );
  const input = {
    endpoint: "/api/contact",
    values: {
      name: "Private Name",
      email: "private@example.cz",
      message: "Private message",
    },
    locale: "en",
    siteKey: "test-only-site-key",
    action: recaptchaActions.contact,
    analytics: { formType: "contact" } satisfies FormSubmissionAnalytics,
  };
  const events = () =>
    nativeView.dataLayer!.filter(
      (item): item is FormAnalyticsEvent =>
        typeof item === "object" &&
        item !== null &&
        "event" in item &&
        (item.event === "generate_lead" ||
          item.event === "job_application_submit"),
    );

  await submitForm(input);
  assert.equal(
    events().length,
    0,
    "unconsented success is not queued for later",
  );
  await act(async () => {
    CookieConsent.acceptService(
      ["vercelAnalytics", "googleAnalytics"],
      "analytics",
    );
  });
  assert.equal(
    view.document.querySelectorAll('script[data-ntpc="GTM"]').length,
    1,
  );
  assert.equal(
    nativeView.document.querySelector<HTMLScriptElement>('[data-ntpc="GTM"]')!
      .src,
    `https://www.googletagmanager.com/gtm.js?id=${environment.NEXT_PUBLIC_GTM_ID}`,
  );
  const denied = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  assert.deepEqual(Array.from(nativeView.dataLayer![0] as IArguments), [
    "consent",
    "default",
    denied,
  ]);
  assert.deepEqual(Array.from(nativeView.dataLayer![1] as IArguments), [
    "consent",
    "update",
    { ...denied, analytics_storage: "granted" },
  ]);
  assert.equal(
    nativeView[`ga-disable-${environment.NEXT_PUBLIC_GA4_ID}`],
    false,
  );
  assert.equal(
    (nativeView.dataLayer![2] as { event: string }).event,
    "gtm.js",
    "the library bootstrap follows consent commands",
  );
  await act(async () => root.render(createElement(SiteMeasurement)));
  assert.equal(
    view.document.querySelectorAll('script[data-ntpc="GTM"]').length,
    1,
    "rerendering never duplicates the library loader",
  );
  assert.equal(
    events().length,
    0,
    "acceptance never replays the earlier submission",
  );

  for (const [action, endpoint, analytics, expected] of [
    [
      recaptchaActions.contact,
      "/api/contact",
      { formType: "contact" },
      {
        event: "generate_lead",
        form_type: "contact",
        site_language: "en",
        job_id: null,
      },
    ],
    [
      recaptchaActions.enquiry,
      "/api/reques-for-quote",
      { formType: "request_for_quote" },
      {
        event: "generate_lead",
        form_type: "request_for_quote",
        site_language: "en",
        job_id: null,
      },
    ],
    [
      recaptchaActions.jobApplication,
      "/api/job-application",
      { formType: "job_application", jobId: "buyer" },
      {
        event: "job_application_submit",
        form_type: "job_application",
        site_language: "en",
        job_id: "buyer",
      },
    ],
  ] as const) {
    const count = events().length;
    await submitForm({
      ...input,
      action,
      endpoint,
      analytics,
      values: { ...input.values, job: "unrelated-job" },
    });
    assert.equal(events().length, count + 1);
    assert.deepEqual(events().at(-1), expected);
  }
  const tracked = events().length;
  await submitForm({
    ...input,
    action: recaptchaActions.jobApplication,
    values: { ...input.values, job: "buyer" },
    analytics: undefined,
  });
  assert.equal(
    events().length,
    tracked,
    "metadata is required; CAPTCHA actions never select events",
  );
  await submitForm(input);
  assert.equal(
    events().at(-1)?.job_id,
    null,
    "a later contact submission clears the previous vacancy",
  );
  assert.doesNotMatch(
    JSON.stringify(nativeView.dataLayer),
    /Private|private@example|test-only-token|unrelated-job/,
  );

  const count = events().length;
  for (const response of [
    Response.json({ success: false }),
    Response.json({ success: true }, { status: 502 }),
  ]) {
    reply = response;
    await assert.rejects(submitForm(input), FormSubmitError);
  }
  assert.equal(events().length, count, "API failures never become leads");
  trackSuccessfulForm({ formType: "contact" }, "private@example.cz");
  assert.equal(
    events().length,
    count,
    "language parameters use a fixed allowlist",
  );

  reply = Response.json({ success: true });
  const queue = nativeView.dataLayer!;
  const push = queue.push;
  queue.push = () => {
    throw new Error("blocked analytics");
  };
  try {
    await assert.doesNotReject(
      submitForm(input),
      "analytics failure cannot fail a valid submission",
    );
  } finally {
    queue.push = push;
  }

  view.document.cookie = "_ga=parent-client; Domain=hokami.cz; Path=/";
  view.document.cookie = "_ga_FRM3KC1HME=host-session; Path=/";
  view.document.cookie = "unrelated=keep; Path=/";
  const reload = t.mock.method(view.location, "reload", () => {
    assert.equal(
      nativeView[`ga-disable-${environment.NEXT_PUBLIC_GA4_ID}`],
      true,
    );
    assert.equal(
      CookieConsent.getCookie().services.analytics.includes("googleAnalytics"),
      false,
    );
  });
  let finishRequest!: (response: Response) => void;
  let requestStarted!: () => void;
  const pending = new Promise<Response>((resolve) => {
    finishRequest = resolve;
  });
  const started = new Promise<void>((resolve) => {
    requestStarted = resolve;
  });
  fetchMock.mock.mockImplementation(async () => {
    requestStarted();
    return pending;
  });
  const submission = submitForm(input);
  await started;
  await act(async () => {
    CookieConsent.acceptService("vercelAnalytics", "analytics");
  });
  assert.equal(reload.mock.callCount(), 1);
  assert.doesNotMatch(view.document.cookie, /(?:^|;\s*)_ga(?:_|=)/);
  assert.match(view.document.cookie, /unrelated=keep/);
  assert.equal(
    CookieConsent.acceptedService("vercelAnalytics", "analytics"),
    true,
  );
  finishRequest(Response.json({ success: true }));
  await submission;
  assert.equal(
    events().length,
    count,
    "withdrawal while submitting suppresses the later event",
  );
});
