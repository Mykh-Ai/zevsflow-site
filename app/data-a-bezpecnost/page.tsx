import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../page-elements";

export const metadata: Metadata = {
  title: "Dáta a bezpečnosť | OfficeFlow",
  description: "Ako OfficeFlow oddeľuje AI porozumenie od kontrolovaného vykonania, pracuje s Google údajmi a podporuje prevádzku na serveri klienta.",
};

export default function DataSecurityPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Dáta a bezpečnosť" title="Asistent dostane iba to, čo potrebuje na dohodnutú úlohu." lead="Bezpečnosť nie je jedno absolútne tvrdenie. Je to súbor technických, organizačných a zmluvných rozhodnutí: kde riešenie beží, kto má prístup, ktoré údaje sa používajú, čo sa zapisuje a ktorý krok musí potvrdiť človek." />

      <section className="section compact-top">
        <div className="shell data-flow-grid">
          <div><p className="eyebrow"><span /> Tok údajov</p><h2>Od správy po výsledok.</h2><p>Konkrétny tok závisí od implementácie, no základný princíp zostáva rovnaký.</p></div>
          <ol className="data-flow"><li><span>01</span><div><h3>Vstup</h3><p>Používateľ odošle text, hlas, fotografiu alebo dokument cez povolený kanál.</p></div></li><li><span>02</span><div><h3>Potrebný kontext</h3><p>Systém vyberie iba údaje potrebné na porozumenie konkrétnej úlohe.</p></div></li><li><span>03</span><div><h3>Validácia kódom</h3><p>Formáty, výpočty, pravidlá a oprávnenia kontroluje aplikačná logika.</p></div></li><li><span>04</span><div><h3>Potvrdenie</h3><p>Zapisujúci alebo citlivý krok môže čakať na výslovné schválenie používateľom.</p></div></li><li><span>05</span><div><h3>Uloženie a záznam</h3><p>Výsledok sa uloží v dohodnutom prostredí a podľa potreby vznikne auditná stopa.</p></div></li></ol>
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell"><div className="section-heading narrow"><p className="eyebrow light"><span /> Ochranné vrstvy</p><h2>AI navrhuje. Oprávnenia a kód určujú, čo sa môže vykonať.</h2></div><div className="security-card-grid"><article><span>01</span><h3>Obmedzený rozsah</h3><p>Asistent má podporovať dohodnuté funkcie, nie neobmedzený prístup ku všetkým firemným systémom.</p></article><article><span>02</span><h3>Serverová validácia</h3><p>Vstupy z messengera ani prehliadača sa nepovažujú automaticky za dôveryhodné.</p></article><article><span>03</span><h3>Potvrdenie človekom</h3><p>Dôležité operácie sa vykonajú až po kontrole náhľadu alebo výslovnom schválení.</p></article><article><span>04</span><h3>Tajomstvá mimo kódu</h3><p>Heslá, OAuth tokeny a integračné kľúče nepatria do zdrojového kódu ani aplikačných logov.</p></article><article><span>05</span><h3>Oddelenie klientov</h3><p>Pri spravovanej službe musí backend overovať príslušnosť každého záznamu ku konkrétnej organizácii.</p></article><article><span>06</span><h3>Obnova a vymazanie</h3><p>Zálohy, test obnovy, retenčné lehoty a odstránenie údajov sa definujú pre zvolený model prevádzky.</p></article></div></div>
      </section>

      <section className="section google-detail">
        <div className="shell google-detail-grid"><div><p className="eyebrow"><span /> Google Drive a Gmail</p><h2>Prístup sa zapína pre konkrétnu funkciu.</h2><p>OfficeFlow nebude žiadať široký prístup iba pre budúce možnosti. Každé oprávnenie musí mať zdokumentovaný používateľský účel.</p><Link className="text-link" href="/google-data">Podrobnosti o Google údajoch →</Link></div><div className="principle-list"><article><h3>Najmenší potrebný scope</h3><p>Pre súbory vytvorené alebo výslovne sprístupnené aplikácii sa ako prvá možnosť posudzuje <code>drive.file</code>. Širší prístup musí mať technické odôvodnenie.</p></article><article><h3>Tokeny na serveri</h3><p>Autorizačný kód sa vymieňa na serveri. Refresh token sa neukladá do URL ani frontendu a pri spravovanej prevádzke musí byť šifrovaný.</p></article><article><h3>Odpojenie</h3><p>Používateľ musí vedieť Google pripojenie zrušiť. OfficeFlow následne odstráni uložený token podľa popísaného postupu.</p></article><article><h3>Žiadne reklamné použitie</h3><p>Údaje Google sa majú používať iba na používateľom zapnuté funkcie, nie na cielenú reklamu ani trénovanie všeobecných AI modelov.</p></article></div></div>
      </section>

      <section className="section deployment-section"><div className="shell"><div className="section-heading narrow"><p className="eyebrow"><span /> Dva režimy</p><h2>Rozdelenie zodpovedností závisí od prevádzky.</h2></div><div className="deployment-grid"><article><span className="card-label">Self-hosted</span><h3>Údaje zostávajú u klienta</h3><p>Klient vlastní server, databázu, Google Cloud Project a integračné údaje. Dočasný prístup OfficeFlow pri inštalácii alebo podpore sa musí dohodnúť a kontrolovať.</p><ul><li>klient určuje zálohy a retenčné lehoty;</li><li>externý AI poskytovateľ sa posudzuje osobitne;</li><li>diagnostické logy nesmú bezdôvodne obsahovať osobné údaje.</li></ul></article><article><span className="card-label managed">Spravované prostredie</span><h3>OfficeFlow zabezpečuje dohodnutú prevádzku</h3><p>Pred spracovaním produkčných dokumentov treba určiť roly, subprocessors, uchovávanie, bezpečnostné opatrenia a postup pri incidente.</p><ul><li>zmluva o spracúvaní údajov podľa skutočných rolí;</li><li>oddelenie organizácií a kontrola prístupov;</li><li>monitoring, zálohy a postup vymazania.</li></ul></article></div></div></section>

      <section className="section public-info-section"><div className="shell"><div className="section-heading narrow"><p className="eyebrow"><span /> Verejné informácie</p><h2>Čo si môžete skontrolovať už teraz.</h2></div><div className="info-link-grid"><Link href="/privacy"><strong>Ochrana súkromia</strong><span>Kategórie údajov, účely, práva a kontakty.</span></Link><Link href="/google-data"><strong>Používanie Google údajov</strong><span>Účel prístupu, obmedzenia a odpojenie.</span></Link><Link href="/data-deletion"><strong>Vymazanie údajov</strong><span>Postup žiadosti a zrušenie Google prístupu.</span></Link><Link href="/support"><strong>Podpora</strong><span>Kontaktný a bezpečnostný kanál.</span></Link></div></div></section>
    </main>
  );
}
