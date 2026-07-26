import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Cookies | ZevsFlow", description: "Informácie o cookies, bezpečnostných technológiách a meraní na webe ZevsFlow." };

export default function CookiesPage() {
  return <LegalLayout title="Cookies" intro="Web ZevsFlow nepoužíva Google Analytics, reklamné pixely, heatmapy ani marketingové cookies.">
    <section><h2>1. Aktuálny stav</h2><p>Základné marketingové a informačné stránky fungujú bez nepovinného sledovania. ZevsFlow nevytvára reklamný profil návštevníka a nepoužíva údaje z formulára na marketingovú rozosielku.</p></section>
    <section><h2>2. Bezpečnostné overenie formulára</h2><p>Formulár žiadosti o pilot používa Cloudflare Turnstile na obmedzenie automatizovaného zneužitia. Turnstile môže používať technické cookies alebo podobné úložiská potrebné na bezpečnostné overenie. Nepoužíva sa na reklamné cielenie.</p></section>
    <section><h2>3. Nevyhnutné technológie</h2><p>Nevyhnutné cookies alebo podobné úložiská môžu udržiavať bezpečnú reláciu, zabrániť zneužitiu a zapamätať technické nastavenie potrebné na požadovanú funkciu. Ich zablokovanie môže znemožniť odoslanie chráneného formulára, nemalo by však brániť čítaniu verejných stránok.</p></section>
    <section><h2>4. Budúca analytika</h2><p>Ak sa neskôr pridá analytika, marketing alebo iný nepovinný obsah tretej strany, táto stránka sa aktualizuje. Nepovinné kategórie sa nesmú aktivovať pred potrebným súhlasom a odmietnutie musí zostať rovnako jednoduché ako prijatie.</p></section>
    <section><h2>5. Nastavenia prehliadača</h2><p>Cookies a úložiská môžete kontrolovať vo svojom prehliadači. Pri obmedzení nevyhnutných technológií môžete žiadosť poslať priamo na <a href="mailto:officezevs2024@gmail.com">officezevs2024@gmail.com</a>.</p></section>
  </LegalLayout>;
}
