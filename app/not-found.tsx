import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main">
      <section className="subpage-hero section">
        <div className="shell subpage-hero-inner">
          <p className="eyebrow"><span /> 404</p>
          <h1>Táto stránka neexistuje.</h1>
          <p className="lead">
            Odkaz môže byť neaktuálny alebo bola adresa zadaná nesprávne.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/">Späť na hlavnú stránku</Link>
            <Link className="button button-ghost" href="/support">Kontakt a podpora</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
