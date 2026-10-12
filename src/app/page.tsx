import { esAR } from "@/messages/es-AR";

export default function HomePage() {
  const { site, home } = esAR;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 sm:px-6">
      <header className="py-6">
        <span className="text-xl font-semibold tracking-tight text-brand">{site.name}</span>
      </header>

      <main className="flex-1 pb-12">
        <section className="py-8 sm:py-14">
          <p className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
            {home.badge}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
            {home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{home.lead}</p>
        </section>

        <section aria-labelledby="features-heading" className="py-4">
          <h2 id="features-heading" className="sr-only">
            {home.featuresHeading}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {home.features.map((feature) => (
              <li key={feature.title} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-sm text-muted">
        <p>{home.statusNote}</p>
      </footer>
    </div>
  );
}
