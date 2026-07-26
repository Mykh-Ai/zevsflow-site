import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../page-elements";
import { PilotApplicationForm } from "./pilot-application-form";

export const metadata: Metadata = {
  title: "Pilot jedného procesu za 200 € | ZevsFlow",
  description:
    "Požiadajte o platený pilot ZevsFlow pre jeden jasne definovaný firemný proces. Cena pilotu je 200 €.",
  alternates: { canonical: "/pilot" },
};

const included = [
  "jeden jasne definovaný opakujúci sa proces",
  "spoločné určenie vstupov, pravidiel, výnimiek a očakávaného výsledku",
  "práca s dohodnutými vzorkami alebo testovacími údajmi",
  "funkčné overenie riešenia v obmedzenom rozsahu",
  "spoločné vyhodnotenie výsledku a ďalších potrebných úprav",
] as const;

const notIncluded = [
  "úplné produkčné nasadenie a neobmedzený počet funkcií",
  "rozsiahla migrácia historických údajov",
  "trvalý hosting, monitoring a podpora po skončení pilotu",
  "platené služby tretích strán, ak sa vopred nedohodne inak",
  "spracovanie hesiel, API kľúčov alebo citlivých dokumentov cez verejný formulár",
] as const;

export default function PilotPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Pilot za 200 €"
        title="Overte jeden konkrétny proces skôr, než investujete do celej implementácie."
        lead="Vyberieme jednu opakujúcu sa firemnú úlohu, presne ohraničíme jej vstupy, pravidlá a výsledok a overíme funkčné riešenie na dohodnutých vzorkách údajov."
      />

      <section className="section compact-top pilot-scope-section">
        <div className="shell pilot-scope-grid">
          <article className="pilot-price-card">
            <p className="eyebrow"><span /> Cena</p>
            <strong>200 €</strong>
            <p>Cena pilotu je konečná. Zevs s. r. o. nie je platiteľom DPH.</p>
            <div className="card-boundary">
              Odoslanie žiadosti nie je objednávkou ani záväzkom zaplatiť. Najskôr spoločne overíme, či sa vybraný proces zmestí do rozsahu pilotu.
            </div>
          </article>

          <div className="pilot-scope-copy">
            <p className="eyebrow"><span /> Rozsah</p>
            <h2>Čo je súčasťou pilotu.</h2>
            <ul className="check-list">
              {included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section dark-section pilot-boundaries-section">
        <div className="shell pilot-boundaries-grid">
          <div>
            <p className="eyebrow light"><span /> Hranice</p>
            <h2>Čo pilot za 200 € nezahŕňa.</h2>
            <p>Jasná hranica chráni obe strany. Rozšírenie, integrácie a produkčná prevádzka sa riešia až po vyhodnotení pilotu.</p>
          </div>
          <ul>
            {notIncluded.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section pilot-next-step-section">
        <div className="shell pilot-next-step-grid">
          <div>
            <p className="eyebrow"><span /> Ďalší krok</p>
            <h2>Implementácia od 750 €.</h2>
          </div>
          <div>
            <p>Ak pilot potvrdí prínos, môžeme dohodnúť produkčné nasadenie, integrácie, prevádzku a podporu. Konečná cena závisí od skutočného rozsahu riešenia.</p>
            <Link className="text-link" href="/automatizacia-na-mieru">Ako prebieha spolupráca →</Link>
          </div>
        </div>
      </section>

      <section className="section pilot-form-section" id="ziadost">
        <div className="shell pilot-form-layout">
          <div className="pilot-form-intro">
            <p className="eyebrow"><span /> Krátka žiadosť</p>
            <h2>Opíšte jeden proces.</h2>
            <p>Technické zadanie nepotrebujete. Stačí vysvetliť, čo dnes opakovane robíte ručne, aké údaje pri tom používate a aký výsledok očakávate.</p>
            <ul className="check-list">
              <li>formulár neprijíma súbory ani citlivé dokumenty;</li>
              <li>na stránke sa neplatí;</li>
              <li>po odoslaní najskôr spoločne overíme vhodnosť procesu;</li>
              <li>odpoveď príde na uvedený kontakt.</li>
            </ul>
          </div>
          <PilotApplicationForm />
        </div>
      </section>
    </main>
  );
}
