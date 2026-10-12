import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import RootLayout, { metadata } from "@/app/layout";
import { esAR } from "@/messages/es-AR";

describe("home page", () => {
  const html = renderToStaticMarkup(<HomePage />);

  it("has exactly one main heading with the product message", () => {
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    expect(h1s).toHaveLength(1);
    expect(html).toContain(esAR.home.title);
  });

  it("explains briefly that Club is a loyalty platform for businesses", () => {
    expect(html).toContain("plataforma de fidelización para comercios");
  });

  it("shows every feature card defined in the messages", () => {
    expect(esAR.home.features.length).toBeGreaterThan(0);
    for (const feature of esAR.home.features) {
      expect(html).toContain(feature.title);
      expect(html).toContain(feature.description);
    }
  });

  it("is honest about being an early version", () => {
    expect(html).toContain(esAR.home.badge);
    expect(html).toContain(esAR.home.statusNote);
  });

  it("does not offer any interactive feature yet (no login, forms or links)", () => {
    // Stage 1 scope guard: accounts, points and panels come in later stages.
    expect(html).not.toMatch(/<(form|input|button|a)[\s>]/);
  });
});

describe("root layout", () => {
  it("declares the document language as Rioplatense Spanish", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>contenido</p>
      </RootLayout>,
    );
    expect(html).toContain('<html lang="es-AR">');
    expect(html).toContain("<p>contenido</p>");
  });

  it("takes title and description from the es-AR messages", () => {
    expect(metadata.description).toBe(esAR.site.description);
    expect(metadata.title).toMatchObject({
      default: expect.stringContaining(esAR.site.name),
    });
  });
});
