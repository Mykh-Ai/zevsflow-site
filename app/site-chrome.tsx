import Link from "next/link";

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Preskočiť na obsah</a>
      <div className="shell nav-shell">
        <Link className="brand brand-with-tagline" href="/#top">
          <Mark />
          <span><strong>OfficeFlow</strong><small>AI automatizácia na mieru</small></span>
        </Link>
        <nav aria-label="Hlavná navigácia">
          <Link href="/automatizacia-na-mieru">Automatizácia na mieru</Link>
          <Link href="/#ukazka">Ukážka</Link>
          <Link href="/data-a-bezpecnost">Dáta a bezpečnosť</Link>
        </nav>
        <Link className="button button-small" href="/#kontakt">Prebrať asistenta</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href="/#top"><Mark />OfficeFlow</Link>
          <p>AI automatizácia na mieru cez asistentov v Telegrame a WhatsAppe.</p>
          <p className="preview-status">Súkromný pracovný náhľad · nie verejná ponuka</p>
        </div>
        <div>
          <strong>Prevádzkovateľ</strong>
          <p>Zevs s. r. o.<br />IČO: 56055552<br />Bratislava, Slovensko</p>
          <Link className="footer-link" href="/support">Kontakt a podpora</Link>
        </div>
        <nav aria-label="Právne informácie">
          <strong>Dáta a podmienky</strong>
          <Link href="/privacy">Ochrana súkromia</Link>
          <Link href="/terms">Podmienky používania</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/google-data">Používanie údajov Google</Link>
          <Link href="/data-deletion">Vymazanie údajov</Link>
        </nav>
      </div>
    </footer>
  );
}
