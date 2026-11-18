"use client";

import { useEffect, useRef, useState } from "react";

const portraits = [
  { name: "Hile", price: "100 €", type: "Minikuvaus", text: "Hile on sulle, joka haluaa nopeat ja hyvät kuvat itsestäsi juuri tähän hetkeen. Näppärä ja juuri sopiva paketti valmistuvalle tai profiilikuvan päivitykseen.", includes: ["Suunnittelu viestitse", "Noin 20 min kuvausaika", "6 valmista kuvaa", "Varausmaksu 25 €"] },
  { name: "Kajo", price: "200 €", type: "Henkilöt, parit ja perheet", text: "Kajo sopii sulle, joka haluaa laajemmat kuvat itsestään, rakkaansa kanssa tai perheen kans rennot kuvat. Oli sitten odottava äiti, perheellinen tai parisuhteessa, tää on hyvä peruspaketti sulle.", includes: ["Suunnittelu viestitse", "Kiireetön kuvausaika", "Väh. 15 valmista kuvaa", "Varausmaksu 50 €"] },
  { name: "Usva", price: "300 €", type: "Parit, perheet ja juhlat", text: "Usva on mun laajempi paketti pareille ja perheille. Tää paketti on dokumentaarisempi ja yksityiskohtaisempi kuvaus – täydellinen perheille, juhliin ja kihlaukseen. Tallentan teidän välisen yhteyden ja kaikki kauniit yksityiskohdat.", includes: ["Suunnittelu viestitse", "Kiireetön kuvausaika", "Koko galleria", "Varausmaksu 70 €"] },
];
const weddings = [
  { name: "Valo", price: "500 €", type: "Hääpotretit", text: "Valo sopii teille, jotka haluatte ikuistaa päivästänne vain hääpotretit. Teidän välinen yhteys – rauhassa ja luonnollisesti.", includes: ["Suunnittelupalaveri 2 kk–2 vk ennen", "1–1,5 h kuvaus", "Väh. 60 valmista kuvaa", "Varausmaksu 100 €"] },
  { name: "Aava", price: "700 €", type: "Hääpotretit ja vihkiminen", text: "Aava sopii teille, jotka haluatte ikuistaa hääpäivän tärkeimmät hetket ilman koko päivän kuvausta. Päivään mahtuu hääpotretit, vihkiminen ja kaikki se mitä syntyy niiden ympärille – läheiset ja teidän välinen rakkaus.", includes: ["Suunnittelupalaveri 2 kk–2 vk ennen", "Hääpotretit, vihkiminen ja ryhmäkuvat", "Sneak peek 48 h sisällä", "Väh. 200 valmista kuvaa", "Varausmaksu 200 €"] },
  { name: "Lumo", price: "1 400 €", type: "Dokumentaarinen hääkuvaus", text: "Lumo on täysi hääpäivä – alusta loppuun. Kahdeksaan tuntiin mahtuu kaikki: valmistautuminen, vihkiminen, potretit, juhla, tunteet, nauru ja ne hetket joita kukaan ei osannut odottaa.", includes: ["Suunnittelupalaveri 2 kk–2 vk ennen", "8 h kuvaus", "Sneak peek 48 h sisällä", "Väh. 350 valmista kuvaa", "Lisätunti 100 €/h", "Varausmaksu 300 €"] },
];

function PackageCard({ pack, index }: { pack: typeof portraits[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = sheet.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: .12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const id = `package-${pack.name.toLowerCase()}`;
  return <article ref={sheet} className={`price-sheet sheet-${index}`}>
    <img className="sheet-clip" src="/clip.svg" alt="" aria-hidden="true" />
    <div className="sheet-heading"><h3>{pack.name}</h3><span>{pack.price}</span></div>
    <p className="package-type">{pack.type}</p>
    <p className="package-description">{pack.text}</p>
    <button className="package-disclosure" aria-expanded={open} aria-controls={id} id={`${id}-toggle`} onClick={() => setOpen(!open)}>Mitä pakettiin kuuluu?<span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div className={`package-expand ${open ? "is-open" : ""}`} id={id} role="region" aria-labelledby={`${id}-toggle`} aria-hidden={!open} inert={!open}><div><ul>{pack.includes.map(item => <li key={item}>{item}</li>)}</ul></div></div>
    <a className="underlined-link" href="#yhteys">Kysy kuvauksesta <svg viewBox="0 0 36 16" fill="none" aria-hidden="true"><path d="M1 8h32M26 1l7 7-7 7" stroke="currentColor" /></svg></a>
  </article>;
}

export default function Pricing() {
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
    <div className="prices-heading" data-enter><span className="small-label">HINNASTO</span><h2>Kuvauspaketit</h2><p>Jos et oo varma mikä sopii sulle parhaiten, laita mulle viestiä, niin mietitään yhdessä.</p>
      <div className="price-toggle" aria-label="Kuvauspaketin tyyppi"><button aria-pressed={!showWeddings} aria-controls="price-packages" onClick={() => setShowWeddings(false)}>Henkilöt, parit & perheet</button><button aria-pressed={showWeddings} aria-controls="price-packages" onClick={() => setShowWeddings(true)}>Häät</button></div>
    </div>
    <div className={`price-sheets${switching ? " is-switching" : ""}`} id="price-packages" aria-busy={switching} inert={switching} aria-label={displayWeddings ? "Hääkuvauspaketit" : "Henkilö-, pari- ja perhekuvauspaketit"}>{(displayWeddings ? weddings : portraits).map((pack, index) => <PackageCard pack={pack} index={index} key={pack.name} />)}</div>
  </section>;
}
