import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generationSchema,
  draftSchema,
  emailSchema,
  passwordSchema,
  safeSourceUrl,
} from "../lib/validation";
import { positiveInt } from "../lib/config";
test("emails are normalized before account lookup", () =>
  assert.equal(emailSchema.parse("  Writer@EXAMPLE.com "), "writer@example.com"));
test("passwords reject short values and bcrypt byte truncation", () => {
  assert.equal(passwordSchema.safeParse("short").success, false);
  assert.equal(passwordSchema.safeParse("🙂".repeat(20)).success, false);
  assert.equal(passwordSchema.safeParse("long-enough-password").success, true);
});
test("generation requires a draft or an idea and caps input size", () => {
  const base = { action: "generate", platform: "LinkedIn", tone: "Natural" };
  assert.equal(generationSchema.safeParse({ ...base, prompt: "  " }).success, false);
  assert.equal(generationSchema.safeParse({ ...base, prompt: "A useful idea" }).success, true);
  assert.equal(generationSchema.safeParse({ ...base, content: "x".repeat(12001) }).success, false);
  assert.equal(
    generationSchema.safeParse({ ...base, platform: "unexpected", prompt: "Idea" }).success,
    false,
  );
});
test("draft identifiers cannot be arbitrary database queries", () => {
  const draft = { title: "Lesson", content: "A post", platform: "X" };
  assert.equal(draftSchema.safeParse({ ...draft, id: "another-user" }).success, false);
  assert.equal(draftSchema.safeParse({ ...draft, id: "a".repeat(24) }).success, true);
});
test("sources reject executable protocols and embedded credentials", () => {
  assert.throws(() => safeSourceUrl("javascript:alert(1)"));
  assert.throws(() => safeSourceUrl("https://user:secret@example.com"));
  assert.equal(safeSourceUrl("https://example.com/article"), "https://example.com/article");
});
test("invalid quotas fall back to a bounded positive default", () => {
  for (const value of [undefined, "-5", "NaN", "0", "1.5"])
    assert.equal(positiveInt(value, 20), 20);
  assert.equal(positiveInt("15", 20), 15);
});
