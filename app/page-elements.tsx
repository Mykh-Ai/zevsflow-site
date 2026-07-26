import Link from "next/link";

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="subpage-hero section">
      <div className="shell subpage-hero-inner">
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}

export function LegalLayout({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main id="main">
      <section className="legal-page section">
        <article className="shell legal-article">
          <nav className="breadcrumbs" aria-label="Omrvinková navigácia"><Link href="/">ZevsFlow</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
          <p className="eyebrow"><span /> Verejné informácie</p>
          <h1>{title}</h1>
          <p className="legal-intro">{intro}</p>
          <p className="updated">Posledná aktualizácia: 26. júla 2026</p>
          <div className="legal-content">{children}</div>
        </article>
      </section>
    </main>
  );
}
