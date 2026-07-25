import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Podmienky používania | ZevsFlow", description: "Pracovný návrh podmienok používania webu a riešení ZevsFlow." };

export default function TermsPage() {
  return <LegalLayout title="Podmienky používania" intro="Tieto pracovné podmienky opisujú základné pravidlá webu a budúcich riešení ZevsFlow. Konkrétna zákazková implementácia sa riadi samostatnou ponukou a zmluvou.">
    <section><h2>1. Poskytovateľ</h2><p>ZevsFlow je pracovné označenie riešení prevádzkovateľa Zevs s. r. o., IČO: 56055552, Karpatské námestie 7770/10A, 831 06 Bratislava – mestská časť Rača.</p></section>
    <section><h2>2. Stav webu</h2><p>Aktuálna verzia je súkromný pracovný náhľad. Informácie na webe nie sú automaticky záväznou ponukou a nenahrádzajú individuálnu technickú, cenovú ani zmluvnú dohodu.</p></section>
    <section><h2>3. Zákazková automatizácia</h2><p>Rozsah pilotu a implementácie sa určuje písomne: podporované vstupy, výstupy, pravidlá, výnimky, integrácie, spôsob prevádzky, podpora a akceptačné kritériá. Cena uvedená ako „od“ je orientačná dolná hranica, nie prísľub neobmedzeného rozsahu.</p></section>
    <section><h2>4. Zodpovednosť používateľa</h2><ul><li>poskytovať oprávnené a primerané testovacie údaje;</li><li>chrániť svoje účty a prístupové údaje;</li><li>kontrolovať náhľady a potvrdzovať dôležité operácie;</li><li>nepoužívať službu na nezákonné spracúvanie alebo neoprávnený prístup;</li><li>overiť výstupy, ak sa používajú pre účtovné, právne alebo iné regulované účely.</li></ul></section>
    <section><h2>5. AI a obmedzenia</h2><p>AI môže nesprávne porozumieť nejednoznačnému alebo nekvalitnému vstupu. Preto sa výpočty, formáty a zapisujúce operácie podľa možností oddeľujú do kontrolovaného kódu a dôležité kroky čakajú na človeka. ZevsFlow nesľubuje bezchybnosť ani úplné odstránenie rizika.</p></section>
    <section><h2>6. Externé služby</h2><p>Funkcia môže závisieť od Telegramu, WhatsAppu, Google, hostingu, emailu, platobnej služby alebo AI poskytovateľa. Ich dostupnosť a pravidlá ZevsFlow nemôže úplne ovládať. Konkrétne závislosti budú uvedené v ponuke alebo produktovej dokumentácii.</p></section>
    <section><h2>7. Duševné vlastníctvo</h2><p>Vlastníctvo zdrojového kódu, konfigurácie, šablón, výstupov a klientskych podkladov sa určí v konkrétnej zmluve. Bez takej dohody web ani ukážky neudeľujú licenciu na kopírovanie alebo ďalší predaj riešenia.</p></section>
    <section><h2>8. Ukončenie a údaje</h2><p>Spôsob ukončenia, exportu a vymazania závisí od modelu prevádzky. Pri budúcej online službe musí byť zrušenie účtu a odpojenie integrácií dostupné podľa zverejnených pokynov.</p></section>
    <section><h2>9. Rozhodné právo</h2><p>Ak záväzná zmluva neurčí inak, právne vzťahy sa riadia právom Slovenskej republiky. Toto ustanovenie neobmedzuje kogentné práva spotrebiteľa, ak sa uplatňujú.</p></section>
  </LegalLayout>;
}
