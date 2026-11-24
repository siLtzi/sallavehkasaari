"use client";

import { useEffect, useState } from "react";
import type { HomeContent, Package } from "../lib/content";

function PackageCard({ pack, texts }: { pack: Package; texts: HomeContent["texts"] }) {
  const [open, setOpen] = useState(false);
  const id = `package-${pack._key}`;
  return <article className="price-sheet">
    <div className="sheet-heading"><h3>{pack.name}</h3><span>{pack.price}</span></div>
    <p className="package-type">{pack.type}</p>
    <p className="package-description">{pack.text}</p>
    <button className="package-disclosure" aria-expanded={open} aria-controls={id} id={`${id}-toggle`} onClick={() => setOpen(!open)}>{texts.packageDetails}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div className={`package-expand ${open ? "is-open" : ""}`} id={id} role="region" aria-labelledby={`${id}-toggle`} aria-hidden={!open} inert={!open}><div><ul>{pack.includes.map((item, index) => <li key={index}>{item}</li>)}</ul></div></div>
    <a className="text-link" href="/#yhteys">{texts.packageContact} <svg viewBox="0 0 36 16" fill="none" aria-hidden="true"><path d="M1 8h32M26 1l7 7-7 7" stroke="currentColor" /></svg></a>
  </article>;
}

export default function Pricing({ content, standalone = false }: { content: HomeContent; standalone?: boolean }) {
  const t = content.texts;
  const [showWeddings, setShowWeddings] = useState(false);
  const [displayWeddings, setDisplayWeddings] = useState(false);
  const switching = showWeddings !== displayWeddings;
  useEffect(() => {
    if (!switching) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function finish() { setDisplayWeddings(showWeddings); }
    const timer = window.setTimeout(finish, reduced.matches ? 0 : 180);
    function motionChanged() { if (reduced.matches) finish(); }
    reduced.addEventListener("change", motionChanged);
    return () => {
      clearTimeout(timer);
      reduced.removeEventListener("change", motionChanged);
    };
  }, [showWeddings, switching]);
  return <section className="prices-section" id="hinnasto">
    <div className="prices-heading"><span className="eyebrow">{t.pricingEyebrow}</span>{standalone ? <h1>{t.pricing}</h1> : <h2>{t.pricing}</h2>}<p>{t.pricingIntro}</p>
      <div className="price-toggle" aria-label={t.packageTypeLabel}><button aria-pressed={!showWeddings} aria-controls="price-packages" onClick={() => setShowWeddings(false)}>{t.portraitPackages}</button><button aria-pressed={showWeddings} aria-controls="price-packages" onClick={() => setShowWeddings(true)}>{t.weddingPackages}</button></div>
    </div>
    <div className={`price-sheets${switching ? " is-switching" : ""}`} id="price-packages" aria-busy={switching} inert={switching} aria-label={displayWeddings ? t.weddingPackagesLabel : t.portraitPackagesLabel}>{(displayWeddings ? content.weddingPackages : content.portraitPackages).map(pack => <PackageCard pack={pack} texts={t} key={pack._key} />)}</div>
  </section>;
}
