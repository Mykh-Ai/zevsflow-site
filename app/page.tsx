import { ProcessDemo } from "./process-demo";
import Link from "next/link";

const problems = [
  "Doklady zostávajú vo fotografiách a správach.",
  "Faktúry, výdavky a pracovné údaje sú v rôznych systémoch.",
  "Rovnaké informácie sa opakovane prepisujú.",
  "Hľadanie potrebného dokumentu zaberá čas.",
  "Na jednoduchú odpoveď treba otvárať tabuľky a hľadať v dokumentoch."
];

const capabilities = [
  ["Doklady", "Prijme fotografiu alebo PDF, vyťaží údaje, ukáže náhľad a uloží potvrdený doklad."],
  ["Dokumenty na mieru", "Podľa pravidiel firmy pripraví typovú zmluvu, objednávku, potvrdenie, faktúru alebo iný dohodnutý dokument."],
  ["Firemné otázky", "Odpovie na otázky o uložených faktúrach, výdavkoch alebo dokumentoch v povolenom rozsahu."],
  ["Email a súbory", "Môže preberať dohodnuté dokumenty z emailu alebo úložiska a zaradiť ich do pracovného toku."],
  ["Pripomienky", "Upozorní na chýbajúci doklad, neuhradenú faktúru alebo krok, ktorý čaká na potvrdenie."],
  ["Výstupy a prehľady", "Vytvorí PDF, tabuľku, report alebo podklady pre účtovníka podľa nastaveného procesu konkrétnej firmy."]
];

const comparison = [
  ["Čaká na nový prompt", "Pracuje v dohodnutom firemnom toku"],
  ["Pozná iba aktuálny rozhovor", "Má prístup k povoleným firemným údajom"],
  ["Vytvorí textovú odpoveď", "Uloží, nájde alebo pripraví výsledok"],
  ["Môže počítať vo voľnom texte", "Výpočty a validáciu vykonáva kód"],
  ["Odpovie okamžite", "Dôležité kroky čakajú na potvrdenie"]
];

export default function Home() {
  return (
    <>
      <main id="main">
        <section className="hero section" id="top">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> AI asistenti pre malé firmy</p>
              <h1>Firemný AI asistent <em>priamo v messengeri.</em></h1>
              <p className="lead">Z telefónu zadáte hlasom alebo textom, čo potrebujete. Asistent sa prispôsobí procesom a pravidlám vašej firmy a v Telegrame alebo WhatsAppe vráti kontrolovaný výsledok.</p>
              <div className="messenger-row" aria-label="Podporované vstupy"><span>Telegram</span><span>WhatsApp</span><span>Hlas</span><span>Text</span><span>Foto a PDF</span></div>
              <div className="hero-actions"><a className="button" href="#ukazka">Pozrieť ukážku</a><a className="button button-ghost" href="#kontakt">Prebrať môj proces</a></div>
              <div className="trust-line"><span className="trust-icon" aria-hidden="true">⌁</span><p><strong>Vyberiete si spôsob prevádzky.</strong> Asistent môže bežať vo vašej infraštruktúre alebo v spravovanom prostredí ZevsFlow podľa dohody.</p></div>
            </div>
            <ProcessDemo compact />
          </div>
        </section>

        <section className="proof-strip" aria-label="Hlavné výhody"><div className="shell proof-grid"><span>Bez novej zložitej aplikácie</span><span>Informácie na jednom mieste</span><span>Rýchle otázky a odpovede</span><span>Kontrola pred vykonaním</span></div></section>

        <section className="section problem-section">
          <div className="shell split-heading"><div><p className="eyebrow"><span /> Každodenná realita</p><h2>Informácie prichádzajú zo všetkých strán. Administratíva zostáva na vás.</h2></div><p>Doklady, správy a pracovné údaje zostávajú roztrúsené medzi telefónom, emailom, tabuľkami a priečinkami. Ich prepisovanie, kontrola a hľadanie zaberajú čas.</p></div>
          <div className="shell problem-list">{problems.map((problem, index) => <div key={problem}><span>{String(index + 1).padStart(2, "0")}</span><p>{problem}</p></div>)}</div>
        </section>

        <section className="section capabilities-section" id="moznosti">
          <div className="shell">
            <div className="section-heading narrow"><p className="eyebrow"><span /> Všetko pod rukou</p><h2>Jedna konverzácia. Viac firemných úloh.</h2><p>Funkcie asistenta sa prispôsobia konkrétnym procesom, zdrojom údajov a pravidlám vašej firmy. Každú podporovanú úlohu môžete z telefónu spustiť a ovládať hlasom alebo textom.</p></div>
            <div className="capability-grid">{capabilities.map(([title, content], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{content}</p></article>)}</div>
          </div>
        </section>

        <section className="section dark-section" id="fungovanie">
          <div className="shell">
            <div className="section-heading narrow"><p className="eyebrow light"><span /> Architektúra dôvery</p><h2>AI rozumie. Kód kontroluje. Človek rozhoduje.</h2><p>Messenger je pohodlný vstup. Za ním je riadený proces, ktorý oddeľuje porozumenie pokynu od vykonania operácie.</p></div>
            <div className="layer-grid"><article><span>01</span><h3>Porozumenie</h3><p>Asistent prijme text, hlas, fotografiu alebo PDF a pripraví štruktúrovaný návrh.</p></article><article><span>02</span><h3>Kontrola</h3><p>Aplikačný kód overí formáty, pravidlá, výpočty, oprávnenia a pracovný priestor.</p></article><article><span>03</span><h3>Vykonanie</h3><p>Používateľ vidí náhľad a potvrdí dôležitý krok. Systém až potom uloží výsledok.</p></article></div>
            <div className="control-flow"><span>Správa</span><i>→</i><span>Návrh AI</span><i>→</i><span>Validácia</span><i>→</i><span>Potvrdenie</span><i>→</i><span>Výsledok</span></div>
          </div>
        </section>

        <section className="section demo-section" id="ukazka">
          <div className="shell demo-layout">
            <div className="demo-copy"><p className="eyebrow"><span /> Jeden pracovný deň</p><h2>Pošlite doklad. Zadajte úlohu hlasom. Neskôr sa jednoducho opýtajte.</h2><p>Asistent uchová potvrdené údaje v správnom firemnom kontexte. Keď potrebujete dokument alebo prehľad, nemusíte prehľadávať galériu, email ani tabuľky.</p><ul className="check-list"><li>fotografia bločku sa zmení na kontrolovaný záznam;</li><li>typová zmluva, objednávka alebo iný dokument sa pripraví z hlasového pokynu;</li><li>výpis alebo súbor sa prevezme z dohodnutého zdroja;</li><li>otázka v messengeri vráti prehľad uložených údajov;</li><li>citlivé alebo zapisujúce kroky čakajú na potvrdenie.</li></ul></div>
            <figure className="video-demo">
              <div className="video-demo-heading">
                <span>Reálna ukážka</span>
                <p>Hlasový pokyn → kontrola → PDF → odpoveď z uložených údajov</p>
              </div>
              <div className="phone-frame">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/media/zevsflow-demo-poster.webp"
                  aria-label="Ukážka vytvorenia faktúry hlasovým pokynom a následnej otázky k uloženým údajom"
                >
                  <source src="/media/zevsflow-demo.mp4" type="video/mp4" />
                  Váš prehliadač nepodporuje prehrávanie videa.
                </video>
              </div>
              <figcaption>
                <strong>Faktúra je iba ukážka.</strong> Rovnaký princíp môže asistent použiť pri inom jasne definovanom procese vašej firmy.
              </figcaption>
              <details className="video-description">
                <summary>Textový opis ukážky</summary>
                <p>Používateľ pošle hlasový pokyn na vytvorenie faktúry. Asistent rozpozná údaje, zobrazí náhľad a čaká na potvrdenie. Po schválení vytvorí PDF s platobnými údajmi. Používateľ sa potom opýta na celkovú hodnotu faktúr za minulý mesiac a asistent odpovie z potvrdených uložených údajov.</p>
              </details>
            </figure>
          </div>
        </section>

        <section className="section comparison-section"><div className="shell"><div className="section-heading"><p className="eyebrow"><span /> Rozdiel</p><h2>Nie ďalší chat. Pracovný nástroj vašej firmy.</h2></div><div className="comparison-table" role="table"><div className="comparison-head" role="row"><span>Bežný AI chat</span><span>ZevsFlow</span></div>{comparison.map(([chat, office]) => <div className="comparison-row" role="row" key={chat}><span>{chat}</span><span>{office}</span></div>)}</div></div></section>

        <section className="section deployment-section" id="prevadzka">
          <div className="shell">
            <div className="section-heading narrow"><p className="eyebrow"><span /> Spôsob prevádzky</p><h2>Vaša infraštruktúra alebo spravované prostredie.</h2><p>Funkčný cieľ zostáva rovnaký. Spolu vyberieme model podľa interných pravidiel, rozpočtu, dostupnej infraštruktúry a požadovanej podpory.</p></div>
            <div className="deployment-grid"><article><span className="card-label">Infraštruktúra klienta</span><h3>Asistent na vašom serveri</h3><p>Databáza, dokumenty a integračné údaje môžu zostať v prostredí, ktoré vlastní a kontroluje klient.</p><ul><li>dohodnutý rozsah inštalácie a podpory;</li><li>prístupy a externé služby sa definujú individuálne;</li><li>vhodné pre firmy s vlastnou infraštruktúrou.</li></ul></article><article><span className="card-label managed">Spravovaná prevádzka</span><h3>Asistent v prostredí ZevsFlow</h3><p>ZevsFlow zabezpečí dohodnuté technické prostredie, monitoring a prevádzku podľa zmluvných podmienok.</p><ul><li>jednoduchší štart bez vlastného servera;</li><li>jasne popísané uchovávanie a spracovanie dát;</li><li>rozsah a podpora podľa konkrétneho riešenia.</li></ul></article></div>
          </div>
        </section>

        <section className="section google-section" id="data">
          <div className="shell google-grid">
            <div><p className="eyebrow light"><span /> Dáta a Google</p><h2>Prístup iba pre funkciu, ktorú si zapnete.</h2><p>Ak riešenie používa Google Drive alebo Gmail, stránka presne vysvetlí účel prístupu, druh spracúvaných údajov, spôsob odpojenia a postup vymazania.</p></div>
            <div className="google-points"><article><span>01</span><div><h3>Minimálny rozsah</h3><p>Požadujú sa iba oprávnenia nevyhnutné pre skutočne zapnutú funkciu.</p></div></article><article><span>02</span><div><h3>Jasný účel</h3><p>Používateľ pred pripojením uvidí, ktoré údaje sa čítajú alebo ukladajú a prečo.</p></div></article><article><span>03</span><div><h3>Odpojenie a vymazanie</h3><p>Verejné pokyny vysvetlia zrušenie prístupu Google aj podanie žiadosti o vymazanie údajov.</p></div></article><article><span>04</span><div><h3>Tokeny mimo frontendu</h3><p>Autorizačné tokeny nepatria do URL, prehliadača ani aplikačných logov.</p></div></article></div>
          </div>
          <nav className="shell legal-preview" aria-label="Verejné informácie"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><Link href="/google-data">Google Data Use</Link><Link href="/data-deletion">Data Deletion</Link><Link href="/support">Support</Link></nav>
        </section>

        <section className="section security-section"><div className="shell security-grid"><div><p className="eyebrow"><span /> Bezpečnosť</p><h2>Kontrola je súčasť produktu.</h2></div><div className="security-points"><div><span>01</span><p><strong>Minimum kontextu.</strong> AI dostane iba údaje potrebné pre konkrétnu úlohu.</p></div><div><span>02</span><p><strong>Potvrdenie.</strong> Dôležité kroky čakajú na človeka.</p></div><div><span>03</span><p><strong>Oddelené prostredia.</strong> Rozsah uloženia a prístupu sa nastaví podľa zvoleného modelu prevádzky.</p></div><div><span>04</span><p><strong>Tajomstvá mimo kódu.</strong> Tokeny a prístupové údaje nepatria do repozitára ani logov.</p></div></div></div></section>

        <section className="section final-cta" id="kontakt"><div className="shell final-cta-inner"><p className="eyebrow light"><span /> Prvý krok</p><h2>Čo by mal váš asistent vybaviť priamo v messengeri?</h2><p>Ukážte jeden opakujúci sa proces. Spoločne určíme vstupy, pravidlá, potvrdenie, výsledok aj spôsob prevádzky.</p><a className="button button-light" href="mailto:officezevs2024@gmail.com">Napísať ZevsFlow</a></div></section>
      </main>
    </>
  );
}
