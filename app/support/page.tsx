import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Kontakt a podpora | ZevsFlow", description: "Kontakt pre obchodné otázky, podporu, ochranu súkromia a bezpečnostné hlásenia ZevsFlow." };

export default function SupportPage() {
  return <LegalLayout title="Kontakt a podpora" intro="Jeden kontaktný bod pre ZevsFlow. Do zavedenia samostatných doménových adries používame firemný Google účet uvedený nižšie.">
    <section><h2>Obchodný dopyt</h2><p>Opíšte jeden opakujúci sa proces, vstupy a požadovaný výsledok. Email: <a href="mailto:officezevs2024@gmail.com?subject=ZevsFlow%20%E2%80%93%20obchodn%C3%BD%20dopyt">officezevs2024@gmail.com</a>.</p></section>
    <section><h2>Technická podpora</h2><p>Uveďte názov firmy, dotknutú funkciu, približný čas problému a bezpečný opis chyby. Neposielajte heslá, OAuth tokeny, API kľúče ani celé citlivé dokumenty.</p></section>
    <section><h2>Ochrana súkromia a vymazanie</h2><p>Do predmetu správy napíšte „Súkromie“ alebo „Vymazanie údajov“. Postup nájdete aj na stránke <a href="/data-deletion">Vymazanie údajov</a>.</p></section>
    <section><h2>Bezpečnostné hlásenie</h2><p>Pri podozrení na únik, neoprávnený prístup alebo zverejnený token označte predmet „BEZPEČNOSŤ“. Neprikladajte aktívne tajomstvá; stačí popis, dotknutý systém a bezpečný spôsob spätného kontaktu.</p></section>
    <section><h2>Prevádzkovateľ</h2><p>Zevs s. r. o.<br />IČO: 56055552<br />Karpatské námestie 7770/10A<br />831 06 Bratislava – mestská časť Rača<br />Slovenská republika</p></section>
    <section><h2>Servisné úrovne</h2><p>Aktuálny pracovný náhľad nemá garantovanú reakčnú dobu ani nepretržitú podporu. Konkrétne časy podpory a riešenia incidentov budú súčasťou ponuky alebo produkčných podmienok.</p></section>
  </LegalLayout>;
}
