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

export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="draft-notice" aria-label="Stav dokumentu">
      <strong>Pracovný návrh</strong>
      <p>{children ?? "Text je pripravený ako podklad. Pred verejným spustením a použitím pri Google OAuth ho musí skontrolovať slovenský právny špecialista."}</p>
    </aside>
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
          <p className="updated">Posledná aktualizácia pracovného návrhu: 19. júla 2026</p>
          <DraftNotice />
          <div className="legal-content">{children}</div>
        </article>
      </section>
    </main>
  );
}
