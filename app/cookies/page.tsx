import type { Metadata } from "next";
import { LegalLayout } from "../page-elements";

export const metadata: Metadata = { title: "Cookies | OfficeFlow", description: "Informácie o cookies a meraní na webe OfficeFlow." };

export default function CookiesPage() {
  return <LegalLayout title="Cookies" intro="Aktuálny pracovný náhľad nepoužíva Google Analytics, reklamné pixely, heatmapy ani marketingové cookies.">
    <section><h2>1. Aktuálny stav</h2><p>Web je navrhnutý tak, aby jeho základné marketingové stránky fungovali bez nepovinného sledovania. Súkromný Sites náhľad môže používať technológie nevyhnutné na prihlásenie, kontrolu oprávnenia, bezpečnosť a doručenie obsahu.</p></section>
    <section><h2>2. Nevyhnutné technológie</h2><p>Nevyhnutné cookies alebo podobné úložiská môžu udržiavať bezpečnú reláciu, zabrániť zneužitiu a zapamätať technické nastavenie potrebné na požadovanú funkciu. Nepoužívajú sa na vytváranie reklamného profilu.</p></section>
    <section><h2>3. Budúca analytika</h2><p>Ak sa neskôr pridá analytika, marketing alebo obsah tretej strany, táto stránka sa aktualizuje. Nepovinné kategórie sa nesmú aktivovať pred potrebným súhlasom a odmietnutie musí zostať rovnako jednoduché ako prijatie.</p></section>
    <section><h2>4. Nastavenia prehliadača</h2><p>Cookies môžete kontrolovať aj vo svojom prehliadači. Zablokovanie nevyhnutných cookies môže znemožniť prihlásenie alebo chránenú funkciu, nemalo by však brániť čítaniu budúcich verejných informačných stránok.</p></section>
  </LegalLayout>;
}
