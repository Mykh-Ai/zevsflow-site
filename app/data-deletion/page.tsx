import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Vymazanie údajov | ZevsFlow", description: "Ako požiadať ZevsFlow o vymazanie údajov a odvolať prístup ku Google účtu." };

export default function DataDeletionPage() {
  return <LegalLayout title="Vymazanie údajov" intro="Používateľ musí mať zrozumiteľný spôsob, ako odpojiť integráciu a požiadať o vymazanie údajov. Táto stránka je pracovným postupom pred implementáciou samoobslužného účtu.">
    <section><h2>1. Odvolanie prístupu Google</h2><ol><li>Otvorte nastavenia svojho Google účtu.</li><li>Prejdite do časti zabezpečenia a pripojení k aplikáciám tretích strán.</li><li>Vyberte ZevsFlow a zrušte všetky udelené prístupy.</li></ol><p>Odvolanie v Google zastaví budúce použitie tokenu. Samo osebe nemusí odstrániť dokumenty, ktoré už používateľ vytvoril alebo uložil vo vlastnom Drive.</p></section>
    <section><h2>2. Žiadosť adresovaná ZevsFlow</h2><p>Kým neexistuje samoobslužný účet, pošlite žiadosť na <a href="mailto:officezevs2024@gmail.com?subject=ZevsFlow%20%E2%80%93%20vymazanie%20%C3%BAdajov">officezevs2024@gmail.com</a> s predmetom „ZevsFlow – vymazanie údajov“. Uveďte email účtu, názov firmy a ktoré pripojenie alebo projekt sa žiadosti týka. Do emailu neposielajte heslá, tokeny ani citlivé dokumenty.</p></section>
    <section><h2>3. Overenie žiadosti</h2><p>Pred vymazaním môže ZevsFlow primerane overiť totožnosť a oprávnenie žiadateľa. Cieľom je zabrániť tomu, aby neoprávnená osoba vymazala firemné údaje alebo integráciu.</p></section>
    <section><h2>4. Čo sa má odstrániť</h2><ul><li>uložené OAuth tokeny a stav pripojenia;</li><li>údaje účtu a nastavenia, ktoré už nie je potrebné uchovávať;</li><li>spravované dokumenty a štruktúrované záznamy podľa rozsahu žiadosti a zmluvných rolí;</li><li>technické odkazy alebo cache, ktoré stratili účel.</li></ul></section>
    <section><h2>5. Výnimky a zálohy</h2><p>Niektoré údaje možno musí prevádzkovateľ dočasne uchovať na splnenie zákonnej povinnosti, ochranu právnych nárokov alebo bezpečnosť. Kópie v zálohách sa odstránia alebo prestanú obnovovať podľa schválenej backup a retention policy. Presné produkčné lehoty sa doplnia pred spustením služby.</p></section>
    <section><h2>6. Self-hosted riešenie</h2><p>Ak riešenie beží na serveri klienta, primárne údaje a zálohy spravuje klient. ZevsFlow odstráni svoje dočasné prístupy a pracovné kópie podľa zmluvy a pokynov klienta.</p></section>
  </LegalLayout>;
}
