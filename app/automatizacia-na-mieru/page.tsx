import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../page-elements";

export const metadata: Metadata = {
  title: "AI automatizácia na mieru | ZevsFlow",
  description: "Firemný AI asistent v Telegrame alebo WhatsAppe pre jeden jasne definovaný opakujúci sa proces. Pilot od 200 €.",
};

const examples = [
  ["Doklady a výdavky", "Prijatie fotografie alebo PDF, rozpoznanie údajov, kategorizácia, kontrola a uloženie."],
  ["Firemné dokumenty", "Príprava objednávky, typovej zmluvy, potvrdenia, faktúry alebo iného dohodnutého výstupu."],
  ["Pracovné údaje", "Zber hodín od pracovníkov, kontrola chýbajúcich údajov a príprava podkladov pre ďalší krok."],
  ["Email a súbory", "Prevzatie dohodnutých príloh, zaradenie dokumentov a odovzdanie do určeného úložiska."],
  ["Otázky nad údajmi", "Rýchly prehľad faktúr, výdavkov, dokumentov alebo stavu procesu bez otvárania tabuliek."],
  ["Reporty a upozornenia", "Pravidelný report, upozornenie na výnimku alebo pripomenutie kroku, ktorý čaká na človeka."],
] as const;

export default function CustomAutomationPage() {
  return (
    <main id="main">
      <PageHero eyebrow="AI automatizácia na mieru" title="Jeden jasný firemný proces. Asistent pripravený pre vašu firmu." lead="ZevsFlow prepája pohodlnú konverzáciu v Telegrame alebo WhatsAppe s kontrolovanou automatizáciou na pozadí. Začíname jednou opakujúcou sa úlohou, pri ktorej vieme presne určiť vstupy, pravidlá, výnimky a výsledok." />

      <section className="section compact-top">
        <div className="shell process-definition">
          <div><p className="eyebrow"><span /> Čo znamená jeden proces</p><h2>Nie neurčitý prísľub. Dohodnutý pracovný tok.</h2><p>Úspešný pilot má jasnú hranicu. Vieme, čo proces spúšťa, ktoré údaje potrebuje, kto kontroluje výsledok a čo sa stane pri neúplnom alebo neobvyklom vstupe.</p></div>
          <dl className="definition-list">
            <div><dt>Vstup</dt><dd>Hlas, text, fotografia, PDF, email alebo údaj zo systému.</dd></div>
            <div><dt>Pravidlá</dt><dd>Formáty, výpočty, povinné polia, oprávnenia a interné postupy.</dd></div>
            <div><dt>Kontrola</dt><dd>Náhľad, otázka na chýbajúci údaj alebo potvrdenie zodpovednou osobou.</dd></div>
            <div><dt>Výsledok</dt><dd>Záznam, dokument, odpoveď, report, upozornenie alebo ďalší systémový krok.</dd></div>
            <div><dt>Výnimky</dt><dd>Neznámy dodávateľ, nečitateľný doklad, duplicita alebo údaj mimo povoleného rozsahu.</dd></div>
            <div><dt>Prevádzka</dt><dd>Server klienta alebo dohodnuté spravované prostredie ZevsFlow.</dd></div>
          </dl>
        </div>
      </section>

      <section className="section capabilities-section">
        <div className="shell"><div className="section-heading narrow"><p className="eyebrow"><span /> Príklady</p><h2>Čo môže asistent vybavovať.</h2><p>Konkrétne funkcie sa skladajú podľa reálnej práce firmy. Hlasové a textové ovládanie z telefónu môže spúšťať celý dohodnutý proces.</p></div><div className="capability-grid">{examples.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
      </section>

      <section className="section dark-section">
        <div className="shell"><div className="section-heading narrow"><p className="eyebrow light"><span /> Spolupráca</p><h2>Od rozhovoru k overenému pilotu.</h2></div><ol className="sales-steps"><li><span>01</span><div><h3>Krátky rozhovor</h3><p>Ukážete, kde vzniká rutina, zdržanie alebo opakované prepisovanie.</p></div></li><li><span>02</span><div><h3>Mapa aktuálneho procesu</h3><p>Spíšeme vstupy, pravidlá, systémy, výnimky a zodpovedné osoby.</p></div></li><li><span>03</span><div><h3>Výber jedného problému</h3><p>Určíme hranicu pilotu a merateľný výsledok.</p></div></li><li><span>04</span><div><h3>Platený pilot · 200 €</h3><p>Overíme funkciu na obmedzenom procese a dohodnutých vzorkách údajov.</p></div></li><li><span>05</span><div><h3>Vyhodnotenie</h3><p>Spoločne posúdime úsporu času, presnosť, výnimky a potrebné úpravy.</p></div></li><li><span>06</span><div><h3>Implementácia · od 750 €</h3><p>Rozšírenie, integrácie a prevádzka sa nacenia podľa skutočného rozsahu.</p></div></li></ol></div>
      </section>

      <section className="section deployment-section">
        <div className="shell"><div className="section-heading narrow"><p className="eyebrow"><span /> Prevádzka</p><h2>Vyberiete si, kde riešenie beží.</h2><p>Spôsob prevádzky nemení základnú myšlienku produktu, ale mení zodpovednosti, prístupy, podporu a podmienky spracovania údajov.</p></div><div className="deployment-grid"><article><span className="card-label">Infraštruktúra klienta</span><h3>Server a údaje pod vašou kontrolou</h3><ul><li>server, databáza a Google credentials patria klientovi;</li><li>tokeny zostávajú v prostredí klienta;</li><li>ZevsFlow má prístup iba počas dohodnutej inštalácie alebo podpory;</li><li>rozsah logov, záloh a aktualizácií sa dohodne vopred.</li></ul></article><article><span className="card-label managed">Spravované prostredie</span><h3>Jednoduchší štart bez vlastného servera</h3><ul><li>oddelené technické prostredie podľa dohodnutého modelu;</li><li>popísané uchovávanie, zálohy a monitoring;</li><li>zmluvné rozdelenie zodpovedností a spracovania údajov;</li><li>presný rozsah podpory a prevádzky v ponuke.</li></ul></article></div></div>
      </section>

      <section className="section final-cta"><div className="shell final-cta-inner"><p className="eyebrow light"><span /> Prvý krok</p><h2>Ktorý proces vám každý týždeň berie čas?</h2><p>Stačí opísať jednu konkrétnu situáciu. Nemusíte pripravovať technické zadanie.</p><div className="cta-row"><a className="button button-light" href="mailto:officezevs2024@gmail.com?subject=ZevsFlow%20%E2%80%93%20m%C3%B4j%20proces">Prebrať môj proces</a><Link className="text-link light-link" href="/data-a-bezpecnost">Ako pracujeme s dátami →</Link></div></div></section>
    </main>
  );
}
