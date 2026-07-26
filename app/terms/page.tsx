import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Podmienky používania | ZevsFlow", description: "Základné podmienky používania webu, žiadosti o pilot a riešení ZevsFlow." };

export default function TermsPage() {
  return <LegalLayout title="Podmienky používania" intro="Tieto podmienky opisujú základné pravidlá webu, žiadosti o pilot a zákazkových riešení ZevsFlow. Konkrétna implementácia sa riadi samostatnou ponukou a zmluvou.">
    <section><h2>1. Poskytovateľ</h2><p>ZevsFlow je označenie riešení prevádzkovateľa Zevs s. r. o., IČO: 56055552, Karpatské námestie 7770/10A, 831 06 Bratislava – mestská časť Rača.</p></section>
    <section><h2>2. Informácie na webe</h2><p>Informácie na webe opisujú spôsob spolupráce a orientačný rozsah služieb. Samy osebe nevytvárajú zmluvu a nenahrádzajú individuálnu technickú, cenovú ani zmluvnú dohodu.</p></section>
    <section><h2>3. Žiadosť o pilot</h2><p>Odoslanie formulára je nezáväznou žiadosťou o posúdenie jedného opakujúceho sa procesu. Nevytvára objednávku, zmluvu, faktúru ani povinnosť zaplatiť. ZevsFlow najskôr overí, či navrhovaný proces zodpovedá rozsahu pilotu.</p><p>Cena dohodnutého pilotu jedného procesu je 200 €. Zevs s. r. o. nie je platiteľom DPH. Platené služby tretích strán nie sú v cene, ak sa strany vopred nedohodnú inak.</p></section>
    <section><h2>4. Zákazková automatizácia</h2><p>Rozsah pilotu a implementácie sa určuje písomne: podporované vstupy, výstupy, pravidlá, výnimky, integrácie, spôsob prevádzky, podpora a akceptačné kritériá. Implementácia uvedená ako „od 750 €“ je dolná hranica pre individuálne nacenenie, nie prísľub neobmedzeného rozsahu za pevnú cenu.</p></section>
    <section><h2>5. Zodpovednosť používateľa</h2><ul><li>poskytovať oprávnené a primerané testovacie údaje;</li><li>neposielať cez verejný formulár heslá, API kľúče, OAuth tokeny ani citlivé dokumenty;</li><li>chrániť svoje účty a prístupové údaje;</li><li>kontrolovať náhľady a potvrdzovať dôležité operácie;</li><li>nepoužívať službu na nezákonné spracúvanie alebo neoprávnený prístup;</li><li>overiť výstupy, ak sa používajú pre účtovné, právne alebo iné regulované účely.</li></ul></section>
    <section><h2>6. AI a obmedzenia</h2><p>AI môže nesprávne porozumieť nejednoznačnému alebo nekvalitnému vstupu. Preto sa výpočty, formáty a zapisujúce operácie podľa možností oddeľujú do kontrolovaného kódu a dôležité kroky čakajú na človeka. ZevsFlow nesľubuje bezchybnosť ani úplné odstránenie rizika.</p></section>
    <section><h2>7. Externé služby</h2><p>Funkcia môže závisieť od Telegramu, WhatsAppu, Google, Cloudflare, hostingu, emailu alebo AI poskytovateľa. Ich dostupnosť a pravidlá ZevsFlow nemôže úplne ovládať. Konkrétne závislosti budú uvedené v ponuke alebo produktovej dokumentácii.</p></section>
    <section><h2>8. Duševné vlastníctvo</h2><p>Vlastníctvo zdrojového kódu, konfigurácie, šablón, výstupov a klientskych podkladov sa určí v konkrétnej zmluve. Bez takej dohody web ani ukážky neudeľujú licenciu na kopírovanie alebo ďalší predaj riešenia.</p></section>
    <section><h2>9. Ukončenie a údaje</h2><p>Spôsob ukončenia, exportu a vymazania závisí od modelu prevádzky a konkrétnej zmluvy. Odpojenie Google integrácií a žiadosť o vymazanie údajov sa riadia zverejnenými pokynmi.</p></section>
    <section><h2>10. Rozhodné právo</h2><p>Ak záväzná zmluva neurčí inak, právne vzťahy sa riadia právom Slovenskej republiky. Toto ustanovenie neobmedzuje kogentné práva spotrebiteľa, ak sa uplatňujú.</p></section>
  </LegalLayout>;
}
