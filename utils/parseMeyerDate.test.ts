import { expect, test } from "vitest";
import parseMeyerDate from "./parseMeyerDate";

test("Parses a date", () => {
  const parsed = parseMeyerDate("02 jun, 2025");
  expect(parsed).toStrictEqual(new Date("2025-06-01T22:00:00.000Z"));
});

test("Parses a date", () => {
  const parsed = parseMeyerDate("23 maj, 2025");
  expect(parsed).toStrictEqual(new Date("2025-05-22T22:00:00.000Z"));
});

test("Parses a date in july", () => {
  const parsed = parseMeyerDate("02 jul, 2025");
  expect(parsed).toStrictEqual(new Date("2025-07-01T22:00:00.000Z"));
});
