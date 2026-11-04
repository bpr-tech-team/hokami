import assert from "node:assert/strict";
import { test } from "node:test";
import {
  contactSchema,
  getContactFieldErrors,
} from "../src/lib/contact/validation";

const valid = {
  name: "  Jana Nováková  ",
  email: "  jana@example.cz  ",
  phone: "",
  message: "  Dobrý den, ráda bych se zeptala na výrobu.  ",
};

test("contact accepts international names, optional phone and trims input", () => {
  const result = contactSchema.parse(valid);
  assert.equal(result.name, "Jana Nováková");
  assert.equal(result.email, "jana@example.cz");
  assert.equal(result.phone, "");
  assert.equal(result.message, "Dobrý den, ráda bych se zeptala na výrobu.");
  assert.ok(
    contactSchema.safeParse({
      ...valid,
      name: "田中 太郎",
      phone: "+81 (0)3 1234 5678 ext. 12",
    }).success,
  );
});

test("contact reports blank required fields and malformed email separately", () => {
  const result = contactSchema.safeParse({
    ...valid,
    name: " ",
    email: " ",
    message: "\n\t",
  });
  assert.equal(result.success, false);
  if (!result.success)
    assert.deepEqual(getContactFieldErrors(result.error), {
      name: "nameRequired",
      email: "emailRequired",
      message: "messageRequired",
    });
  const invalidEmail = contactSchema.safeParse({
    ...valid,
    email: "not-an-email",
  });
  assert.equal(invalidEmail.success, false);
  if (!invalidEmail.success)
    assert.deepEqual(getContactFieldErrors(invalidEmail.error), {
      email: "emailInvalid",
    });
});

test("contact accepts the length limits and rejects one character beyond them", () => {
  const limits = { name: 120, phone: 50, message: 5000 } as const;
  for (const [field, max] of Object.entries(limits)) {
    assert.ok(
      contactSchema.safeParse({ ...valid, [field]: "x".repeat(max) }).success,
    );
    const result = contactSchema.safeParse({
      ...valid,
      [field]: "x".repeat(max + 1),
    });
    assert.equal(result.success, false);
    if (!result.success)
      assert.deepEqual(getContactFieldErrors(result.error), {
        [field]: "tooLong",
      });
  }
  const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`;
  assert.equal(email.length, 254);
  assert.ok(contactSchema.safeParse({ ...valid, email }).success);
  assert.equal(
    contactSchema.safeParse({ ...valid, email: `${email}d` }).success,
    false,
  );
});
