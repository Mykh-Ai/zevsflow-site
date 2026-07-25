"use client";

import { useEffect, useState } from "react";

const steps = [
  ["Správa", "Doklad prijatý", "Používateľ poslal fotografiu bločku priamo do messengera."],
  ["Údaje", "Obsah rozpoznaný", "Dodávateľ, dátum, suma a položky sú pripravené na kontrolu."],
  ["Kontrola", "Čaká na človeka", "Asistent ukazuje náhľad a navrhnutú kategóriu výdavku."],
  ["Uloženie", "Doklad potvrdený", "Potvrdené údaje a pôvodný súbor sú uložené v správnom kontexte."],
  ["Otázka", "Prehľad pripravený", "„Koľko som tento mesiac minul na materiál?“"],
  ["Odpoveď", "1 842,60 €", "Súhrn vychádza z potvrdených dokladov a odkazuje na zdrojové záznamy."]
] as const;

export function ProcessDemo({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % steps.length), 2600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className={`process-demo ${compact ? "compact" : ""}`}>
      <div className="demo-topline"><span className="live-dot" /><span>OfficeFlow · Telegram</span><span>ONLINE</span></div>
      <div className="demo-command"><span className="receipt-preview" aria-hidden="true"><i /><i /><i /><b>48,90 €</b></span><p>„Ulož tento bloček ako materiál na zákazku Novák.“</p></div>
      <ol className="demo-steps">{steps.map((step, index) => <li key={step[0]} className={index === active ? "active" : index < active ? "done" : ""}><button type="button" onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{step[0]}</button></li>)}</ol>
      <div className="demo-result" aria-live="polite"><div><small>{steps[active][0]}</small><strong>{steps[active][1]}</strong><p>{steps[active][2]}</p></div><b>{active === 5 ? "✓" : "→"}</b></div>
    </div>
  );
}
