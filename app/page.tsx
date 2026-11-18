"use client";
import Pricing from "./Pricing";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const base = "https://images-pw.pixieset.com/site/NQ7zQx/";
const photos = [
  { src: base + "MZaZ0j/6-48221054-1500.jpg", label: "Parikuvaus", alt: "Pariskunta luonnossa iltavalossa" },
  { src: base + "abmvoQ/1-f039d9db-1500.jpg", label: "Hääkuvaus", alt: "Hääpäivän yksityiskohta" },
  { src: base + "5ZkZxe/16-d0127851-1500.jpg", label: "Parikuvaus", alt: "Pariskunnan yhteinen hetki ulkona" },
  { src: base + "n4Y4ay/22-a46aec27-1500.jpg", label: "Potrettikuvaus", alt: "Ylioppilaskuva luonnossa" },
];
const portrait = base + "lD8E0G/luontominabest-b2ab39ef-1500.jpg";
const navigation = [["portfolio", "Portfolio"], ["minusta", "Minusta"], ["info", "Info"], ["hinnasto", "Hinnasto"], ["yhteys", "Ota yhteyttä"]];
const Arrow = () => <svg viewBox="0 0 36 16" fill="none" aria-hidden="true"><path d="M1 8h32M26 1l7 7-7 7" stroke="currentColor" /></svg>;

function Print({ index, onOpen, priority = false }: { index: number; onOpen: (index: number) => void; priority?: boolean }) {
  const photo = photos[index];
  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const b = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tx", `${-(event.clientY - b.top - b.height / 2) / b.height * 9}deg`);
    event.currentTarget.style.setProperty("--ty", `${(event.clientX - b.left - b.width / 2) / b.width * 9}deg`);
  }
  return <button className="print" onClick={() => onOpen(index)} onPointerMove={tilt} onPointerLeave={e => { e.currentTarget.style.setProperty("--tx", "0deg"); e.currentTarget.style.setProperty("--ty", "0deg"); }} aria-label={`Avaa ${photo.label.toLowerCase()}`}><span className="print-image"><img src={photo.src} alt={photo.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /><span className="gloss" /></span><span className="print-caption"><span>{photo.label}</span><small>S. V.</small></span></button>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const intro = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const focusBefore = useRef<HTMLElement | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menu) return;
    const desktop = matchMedia("(min-width: 701px)");
    function closeOnDesktop() { if (desktop.matches) setMenu(false); }
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const links = navigationRef.current?.querySelectorAll<HTMLAnchorElement>("a");
      if (!links?.length) return;
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menuButton.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === menuButton.current) { event.preventDefault(); links[0].focus(); }
    }
    navigationRef.current?.querySelector("a")?.focus({ preventScroll: true });
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("resize", closeOnDesktop);
    window.addEventListener("keydown", trapFocus);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", closeOnDesktop);
      window.removeEventListener("keydown", trapFocus);
      menuButton.current?.focus({ preventScroll: true });
    };
  }, [menu]);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); observer.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll("[data-enter]").forEach(el => observer.observe(el));
    let frame = 0;
    function update() {
      frame = 0;
      if (reduced.matches) return;
      if (hero.current) { const b = hero.current.getBoundingClientRect(); hero.current.style.setProperty("--p", String(Math.max(0, Math.min(1, -b.top / Math.max(1, b.height - innerHeight))))); }
      if (intro.current) { const b = intro.current.getBoundingClientRect(); intro.current.style.setProperty("--a", String(Math.max(0, Math.min(1, (innerHeight - b.top) / (innerHeight + b.height))))); }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = active !== null || menu ? "hidden" : "";
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", escape); };
  }, [active, menu]);
  function openPhoto(i: number) { focusBefore.current = document.activeElement as HTMLElement; setActive(i); dialog.current?.showModal(); }
  function closePhoto() { dialog.current?.close(); setActive(null); focusBefore.current?.focus(); }
  function movePhoto(d: number) { setActive(i => i === null ? 0 : (i + d + photos.length) % photos.length); }
  function moveRail(d: number) { if (rail.current) rail.current.scrollBy({ left: d * rail.current.clientWidth * .65, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }

  return <>
    <a className="skip" href="#sisalto">Siirry sisältöön</a>
    <header><a className="monogram" href="#" aria-label="Salla Vehkasaari, etusivu" inert={menu}><img className="brand-logo" src="/sv.png" alt="" width={500} height={500} /></a><nav ref={navigationRef} className={menu ? "navigation is-open" : "navigation"} id="navigation" aria-label="Päänavigaatio"><p className="menu-eyebrow small-label">SALLA VEHKASAARI · VALOKUVAAJA</p>{navigation.map(([id, label], index) => <a href={`#${id}`} key={id} onClick={() => setMenu(false)}><span className="menu-number" aria-hidden="true">0{index + 1}</span>{label}<span className="menu-arrow" aria-hidden="true">↗</span></a>)}<p className="menu-note">Valokuvia sun näköisestä elämästä.</p></nav><button ref={menuButton} className="menu-button" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? "Sulje" : "Valikko"}<span className="menu-icon" aria-hidden="true"><span /><span /></span></button></header>
    <main id="sisalto" inert={menu}>
      <section className="cover" ref={hero}><div className="cover-sticky"><div className="cover-heading"><p className="small-label">VALOKUVAAJA · PIRKKALA & TAMPERE</p><h1><span>salla</span><span>vehkasaari</span></h1></div><div className="cover-photos" aria-label="Valokuvia portfoliosta">{[3, 1, 0, 2].map((index, slot) => <div className={`cover-print cp-${slot}`} key={index}><Print index={index} onOpen={openPhoto} priority /></div>)}</div><div className="cover-caption"><p>Valokuvausta sulle,<br />joka haluat olla oma itsesi.</p><a href="#portfolio">Tutustu portfolioon <Arrow /></a></div><span className="scroll-note">selaa alaspäin <span>↓</span></span></div></section>

      <section className="introduction" id="minusta" ref={intro}><div className="portrait-layout" data-enter><div className="portrait-print"><span className="tape" /><img src={portrait} alt="Salla kukkaniityllä" loading="lazy" /><span className="handwriting">hei, oon Salla.</span></div><div className="little-print"><img src={photos[3].src} alt="Potrettikuva luonnossa" loading="lazy" /></div><span className="margin-note">kameran takana</span></div><div className="intro-text" data-enter><span className="small-label">MINUSTA</span><h2>Hei, oon Salla.</h2><p>Oon Pirkkalassa asuva valokuvaaja ja kuvaan kaikenlaisia henkilökuvia.</p><p>Mulle valokuvaus on tapa pysähtyä tärkeiden hetkien äärelle. Rakastan luonnon rauhaa, aitoja kohtaamisia ja kuvia, joissa ihmisen ei tarvi olla mitään muuta kuin oma itsensä.</p><p>Oon luonteeltani aito, rento ja rauhallinen, mutta ystävien kanssa musta kuoriutuu aika räiskyväkin persoona.</p><p>Haluan luoda kuvaustilanteen, jossa on helppo hengittää ja olla läsnä. Autan sua rentoutumaan kameran edessä, jotta voit keskittyä hetkeen.</p><a className="underlined-link" href="#yhteys">Ota yhteyttä <Arrow /></a></div></section>

      <section className="album-section" id="portfolio"><div className="album-heading" data-enter><div><span className="small-label">PORTFOLIO</span><h2>Muutamia mun kuvia</h2></div><div className="album-controls"><span>Selaa kuvia</span><button onClick={() => moveRail(-1)} aria-label="Selaa vasemmalle">←</button><button onClick={() => moveRail(1)} aria-label="Selaa oikealle">→</button></div></div><div className="photo-rail" ref={rail} tabIndex={0} role="region" aria-label="Valokuva-albumi, selaa vaakasuunnassa">{[1, 0, 3, 2].map((index, slot) => <div className={`album-item ai-${slot}`} key={index}><Print index={index} onOpen={openPhoto} /><span className="image-number">{String(slot + 1).padStart(2, "0")}</span></div>)}</div><div className="album-footer"><p>Oon visuaalinen ja luonnonläheinen ihminen,<br />ja sen näkee mun kuvissa.</p><span className="handwriting">Klikkaa kuvaa, niin näet sen isompana.</span></div></section>

      <section className="info-section" id="info"><div className="info-title" data-enter><span className="small-label">KUVAUKSEEN TULEMINEN</span><h2>Jos sua vähän<br />jännittää,</h2><p>niin se ei haittaa. Sun ei tarvitse osata olla kuvattavana. Mä autan.</p><div className="info-print"><img src={photos[2].src} alt="Parikuvaus ulkona" loading="lazy" /></div></div><div className="notebook" data-enter><span className="notebook-label">Näin kuvaus etenee</span>{[
        ["01", "Ota yhteyttä", "Lähetä mulle viestiä haluamastasi kuvauksesta. Sulla ei tarvitse olla valmista suunnitelmaa."],
        ["02", "Suunnitellaan", "Suunnitellaan kuvausta viestitse, puhelimitse tai kasvokkain. Voin ehdottaa kuvauspaikkoja ja ideoita, jos sulla ei ole vielä ajatusta."],
        ["03", "Kuvataan", "Nähdään sovittuna aikana ja lähdetään kuvailemaan. Ohjaan sua tarvittaessa ja pidetään kuvaus rentona."],
        ["04", "Saat kuvat", "Lähetän valmiiksi muokatut kuvat salasanalla suojatussa nettigalleriassa 2–6 viikon päästä kuvauspäivästä."],
      ].map(([n, title, text]) => <div className="notebook-row" key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

      <Pricing />

      <section className="contact-section" id="yhteys"><div className="contact-heading" data-enter><span className="small-label">OTA YHTEYTTÄ</span><h2>Nappasiko?</h2><p>Haluaisitko mut kuvaamaan sun tärkeetä päivää?<br />Kerro vähän itsestäsi ja siitä, millaista kuvausta mietit.</p></div><div className="postcard" data-enter><div className="postcard-message"><div className="postcard-stamp"><img className="brand-logo" src="/sv.png" alt="Salla Vehkasaari" width={500} height={500} /><small>VALOKUVAUS</small></div><p className="handwriting">Kirjoita mulle</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><div className="form-pair"><label>Nimi<input name="name" autoComplete="name" required /></label><label>Sähköposti<input name="email" type="email" autoComplete="email" required /></label></div><label>Millaista kuvausta mietit?<select name="type" defaultValue="" required><option disabled value="">Valitse kuvaus</option><option>Henkilökuvaus</option><option>Parikuvaus</option><option>Perhekuvaus</option><option>Hääkuvaus</option><option>Jotain muuta</option></select></label><label>Viesti<textarea name="message" rows={3} placeholder="Kuvauksen ajankohta, paikka, toiveet…" required /></label><div className="form-end"><small>Luonnos — viestiä ei lähetetä.</small><button type="submit">Kokeile lomaketta <Arrow /></button></div><p className="form-status" role="status">{submitted ? "Lomake toimii. Viestiä ei lähetetty, sillä tämä on sivuston luonnos." : ""}</p></form></div><div className="postcard-photo"><img src={photos[0].src} alt="Parikuva luonnon keskellä" loading="lazy" /><span>Salla Vehkasaari</span></div></div></section>
    </main>
    <footer inert={menu}><a href="#" className="footer-signature" aria-label="Salla Vehkasaari, etusivu"><img className="brand-logo" src="/sv.png" alt="Salla Vehkasaari" width={500} height={500} /></a><a href="https://www.instagram.com/sallavehkasaari/" target="_blank" rel="noreferrer">@sallavehkasaari</a><div><span>© {new Date().getFullYear()} Salla Vehkasaari</span><a href="#">Takaisin ylös ↑</a></div></footer>
    <dialog className="lightbox" ref={dialog} aria-label="Valokuvan katselu" onCancel={closePhoto} onClick={e => { if (e.target === e.currentTarget) closePhoto(); }} onKeyDown={e => { if (e.key === "ArrowRight") movePhoto(1); if (e.key === "ArrowLeft") movePhoto(-1); }}><button className="lightbox-close" onClick={closePhoto}>Sulje ×</button>{active !== null && <div className="lightbox-content"><div className="lightbox-print" key={active}><img src={photos[active].src} alt={photos[active].alt} /><span>{photos[active].label}</span></div><div className="lightbox-controls"><button onClick={() => movePhoto(-1)} aria-label="Edellinen kuva">←</button><span>{active + 1} / {photos.length}</span><button onClick={() => movePhoto(1)} aria-label="Seuraava kuva">→</button></div></div>}</dialog>
  </>;
}
