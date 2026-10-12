import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

/** Variables whose value must never be committed. */
const SENSITIVE_NAME = /(SECRET|PASSWORD|TOKEN|PRIVATE|KEY)/;

describe(".env.example", () => {
  const entries = read(".env.example")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "" && !line.trimStart().startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return { name: line.slice(0, index).trim(), value: line.slice(index + 1).trim() };
    });

  it("lists the expected variables", () => {
    const names = entries.map((entry) => entry.name);
    expect(names).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(names).toContain("SUPABASE_SECRET_KEY");
  });

  it("never contains a value for keys, secrets, passwords or tokens", () => {
    const leaked = entries.filter((e) => SENSITIVE_NAME.test(e.name) && e.value !== "");
    expect(leaked).toEqual([]);
  });

  it("never exposes the secret key to the browser (no NEXT_PUBLIC_ prefix)", () => {
    const exposed = entries.filter((e) => /SECRET|PRIVATE|PASSWORD/.test(e.name) && e.name.startsWith("NEXT_PUBLIC_"));
    expect(exposed).toEqual([]);
  });
});

describe(".gitignore", () => {
  const rules = read(".gitignore").split(/\r?\n/).map((line) => line.trim());

  it("ignores local environment files but keeps the example tracked", () => {
    expect(rules).toContain(".env");
    expect(rules).toContain(".env.*");
    expect(rules).toContain("!.env.example");
  });

  it("ignores installed dependencies and build output", () => {
    expect(rules).toContain("node_modules/");
    expect(rules).toContain(".next/");
  });
});
