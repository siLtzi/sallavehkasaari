"use client";

import { useEffect, useRef, useState } from "react";
import Pricing from "./Pricing";

const base = "https://images-pw.pixieset.com/site/NQ7zQx/";
const photos = [
  { src: base + "MZaZ0j/6-48221054-1500.jpg", label: "Parikuvaus", alt: "Pariskunta luonnossa iltavalossa" },
  { src: base + "abmvoQ/1-f039d9db-1500.jpg", label: "Hääkuvaus", alt: "Hääpäivän yksityiskohta" },
  { src: base + "5ZkZxe/16-d0127851-1500.jpg", label: "Parikuvaus", alt: "Pariskunnan yhteinen hetki ulkona" },
  { src: base + "n4Y4ay/22-a46aec27-1500.jpg", label: "Potrettikuvaus", alt: "Ylioppilaskuva luonnossa" },
  { src: base + "m38XJo/DSC02433-75e6bfee-1500.jpg", label: "Hääkuvaus", alt: "Hääpari käsi kädessä" },
  { src: base + "9k40A5/DSC00474-2c415b5c-1500.jpg", label: "Parikuvaus", alt: "Parikuva Sallan portfoliosta" },
  { src: base + "Paeywn/11-0854efcd-1500.jpg", label: "Potrettikuvaus", alt: "Ylioppilas metsässä" },
  { src: base + "8pDJe1/DSC09269-de40e7d9-1500.jpg", label: "Perhekuvaus", alt: "Perhekuva Sallan portfoliosta" },
  { src: base + "Myw0Gj/DSC07359-eb679f32-1500.jpg", label: "Perhekuvaus", alt: "Perhe yhdessä ulkona" },
];
const portrait = base + "lD8E0G/luontominabest-b2ab39ef-1500.jpg";
const portfolioGroups = [[4, 1], [5, 2], [6, 3], [7, 8]];
const portfolioOrder = portfolioGroups.flat();
const navigation = [["portfolio", "Portfolio"], ["minusta", "Minusta"], ["info", "Info"], ["hinnasto", "Hinnasto"], ["yhteys", "Ota yhteyttä"]];
const displayFonts = [
  { id: "bodoni", label: "Bodoni Moda" },
  { id: "poiret", label: "Poiret One" },
  { id: "dorsa", label: "Dorsa" },
] as const;
type DisplayFont = typeof displayFonts[number]["id"];

const Arrow = () => <svg viewBox="0 0 36 16" fill="none" aria-hidden="true"><path d="M1 8h32M26 1l7 7-7 7" stroke="currentColor" /></svg>;

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [heroOnly, setHeroOnly] = useState(false);
  const [displayFont, setDisplayFont] = useState<DisplayFont>("bodoni");
  const [active, setActive] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const focusBefore = useRef<HTMLElement | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menu) return;
    const desktop = matchMedia("(min-width: 701px)");
    function closeOnDesktop() { if (!heroOnly && desktop.matches) setMenu(false); }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenu(false); return; }
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
    window.addEventListener("keydown", handleKey);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", closeOnDesktop);
      window.removeEventListener("keydown", handleKey);
      if (heroOnly || !desktop.matches) menuButton.current?.focus({ preventScroll: true });
    };
  }, [menu, heroOnly]);

  useEffect(() => {
    if (!menu && active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menu, active]);

  function openPhoto(index: number) {
    focusBefore.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActive(index);
    dialog.current?.showModal();
  }
  function closePhoto() {
    dialog.current?.close();
    setActive(null);
    focusBefore.current?.focus();
  }
  function movePhoto(direction: number) {
    setActive(index => {
      if (index === null) return portfolioOrder[0];
      const position = portfolioOrder.indexOf(index);
      return portfolioOrder[(position + direction + portfolioOrder.length) % portfolioOrder.length];
    });
  }
  function changeView(nextHeroOnly: boolean) {
    setMenu(false);
    setHeroOnly(nextHeroOnly);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return <div className={`site site--${displayFont}${heroOnly ? " site--hero" : ""}`}>
    <a className="skip" href="#sisalto">Siirry sisältöön</a>
    <aside className="preview-switch" aria-label="Luonnoksen vertailu" inert={menu || active !== null}>
      <div className="preview-group">
        <span>NÄKYMÄ</span>
        <div className="preview-options" role="group" aria-label="Valitse etusivun näkymä">
          <button type="button" aria-pressed={!heroOnly} onClick={() => changeView(false)}>Koko etusivu</button>
          <button type="button" aria-pressed={heroOnly} onClick={() => changeView(true)}>Vain hero</button>
        </div>
      </div>
      <div className="preview-group">
        <span>OTSIKOT</span>
        <div className="preview-options" role="group" aria-label="Valitse otsikkofontti">
          {displayFonts.map(font => <button type="button" key={font.id} aria-pressed={displayFont === font.id} onClick={() => setDisplayFont(font.id)}>{font.label}</button>)}
        </div>
      </div>
    </aside>
    <header className="site-header">
      <a className={heroOnly ? "brand" : "brand brand--wordmark"} href="#" aria-label="Salla Vehkasaari, etusivu" inert={menu}>
        {heroOnly ? <><img src="/sv.png" alt="" width={500} height={500} /><span>Salla Vehkasaari<small>VALOKUVAAJA</small></span></> : <img className="brand-wordmark" src="/SV%20logo.png" alt="" width={2172} height={724} />}
      </a>
      <nav ref={navigationRef} className={menu ? "navigation is-open" : "navigation"} id="navigation" aria-label="Päänavigaatio">
        <p className="menu-eyebrow">SALLA VEHKASAARI · VALOKUVAAJA</p>
        <div className="menu-links">{navigation.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>{label}</a>)}</div>
        <div className="menu-visual" aria-hidden="true"><img src={photos[5].src} alt="" /><span>PIRKKALA &amp; TAMPERE</span></div>
      </nav>
      <button ref={menuButton} className="menu-button" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>
        {menu ? "Sulje" : "Valikko"}<span className="menu-icon" aria-hidden="true"><span /><span /></span>
      </button>
    </header>

    <main id="sisalto" inert={menu}>
      <section className="hero" aria-label="Salla Vehkasaari Valokuvaus">
        <div className="hero-art">
          {heroOnly && <picture className="hero-fullscreen">
            <source media="(min-width: 701px)" srcSet={base + "PY98Z3/DSC04521-bafe8cf9-1500.jpg"} />
            <img src={base + "KvYRJx/DSC04519-9680c586-1500.jpg"} alt="Pariskunta istuu kallioisessa maisemassa" fetchPriority="high" />
          </picture>}
          <div className="hero-images">
            <div className="hero-image hero-image-side"><img src={photos[4].src} alt="" /></div>
            <div className="hero-image hero-image-main"><img src={photos[0].src} alt={photos[0].alt} fetchPriority="high" /></div>
            <div className="hero-image hero-image-side"><img src={photos[6].src} alt="" /></div>
          </div>
          {heroOnly && <img className="hero-logo" src="/SV%20logo.png" alt="" width={2172} height={724} />}
        </div>
        <div className="hero-bottom"><h1>Valokuvaaja Salla Vehkasaari</h1><p>Pirkkala &amp; Tampere</p><a href="#portfolio">Tutustu kuviin <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="portfolio-section section-wrap" id="portfolio">
        <div className="portfolio-heading"><h2>Portfolio</h2></div>
        <div className="portfolio-grid">
          {portfolioGroups.map(group => <section className="portfolio-group" key={photos[group[0]].label}>
            <h3>{photos[group[0]].label}</h3>
            <div className="portfolio-photos">
              {group.map(index => <button className="portfolio-item" key={index} onClick={() => openPhoto(index)} aria-label={`Avaa kuva: ${photos[index].alt}`}>
                <span className="portfolio-image"><img src={photos[index].src} alt={photos[index].alt} loading="lazy" /></span>
              </button>)}
            </div>
          </section>)}
        </div>
      </section>

      <section className="about-section" id="minusta">
        <div className="about-inner">
          <div className="about-image"><img src={portrait} alt="Salla kukkaniityllä" loading="lazy" /></div>
          <div className="about-copy">
            <p className="eyebrow">KAMERAN TAKANA</p>
            <h2>Hei, oon Salla.</h2>
            <p>Oon Pirkkalassa asuva valokuvaaja. Rakastan luonnon rauhaa, aitoja kohtaamisia ja kuvia, joissa ihmisen ei tarvi olla mitään muuta kuin oma itsensä.</p>
            <p>Haluan luoda kuvaustilanteen, jossa on helppo hengittää ja olla läsnä. Autan sua rentoutumaan kameran edessä, jotta voit keskittyä hetkeen.</p>
            <img className="signature" src="/sv%20text.png" alt="Salla Vehkasaari" width={1758} height={885} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="experience-section section-wrap" id="info">
        <div><p className="eyebrow">TIETOA KUVAUKSESTA</p><h2>Kuvaukseen tuleminen</h2></div>
        <div className="experience-copy"><p>Jos sua vähän jännittää, se ei haittaa. Sun ei tarvitse osata olla kuvattavana — mä autan.</p><details><summary>Näin kuvaus etenee <span aria-hidden="true">+</span></summary><p>Suunnitellaan kuvausta viestitse, puhelimitse tai kasvokkain. Voin ehdottaa kuvauspaikkoja ja ideoita, jos sulla ei ole vielä ajatusta. Kuvaustilanteessa ohjaan sua tarvittaessa ja pidetään kuvaus rentona.</p><p>Lähetän valmiiksi muokatut kuvat salasanalla suojatussa nettigalleriassa 2–6 viikon päästä kuvauspäivästä.</p></details></div>
      </section>

      <Pricing />

      <section className="contact-section" id="yhteys">
        <div className="contact-inner">
          <div className="contact-heading"><p className="eyebrow">SALLA VEHKASAARI VALOKUVAUS</p><h2>Ota yhteyttä</h2><p>Haluaisitko mut kuvaamaan? Kerro vähän itsestäsi ja siitä, millaista kuvausta mietit.</p><span className="contact-detail">PIRKKALA & TAMPERE</span></div>
          <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            <div className="form-pair"><label>Nimi<input name="name" autoComplete="name" required /></label><label>Sähköposti<input name="email" type="email" autoComplete="email" required /></label></div>
            <label>Millaista kuvausta mietit?<select name="type" defaultValue="" required><option disabled value="">Valitse kuvaus</option><option>Henkilökuvaus</option><option>Parikuvaus</option><option>Perhekuvaus</option><option>Hääkuvaus</option><option>Jotain muuta</option></select></label>
            <label>Viesti<textarea name="message" rows={3} placeholder="Kuvauksen ajankohta, paikka, toiveet…" required /></label>
            <div className="form-end"><small>Luonnos — viestiä ei lähetetä.</small><button type="submit">Kokeile lomaketta <Arrow /></button></div>
            <p className="form-status" role="status">{submitted ? "Lomake toimii. Viestiä ei lähetetty, sillä tämä on sivuston luonnos." : ""}</p>
          </form>
        </div>
      </section>
    </main>

    <footer inert={menu}>
      <a href="#" className="footer-brand" aria-label="Salla Vehkasaari, etusivu"><img src="/sv.png" alt="" width={500} height={500} /><span>Salla Vehkasaari<small>VALOKUVAAJA</small></span></a>
      <div className="footer-links"><a href="#portfolio">Portfolio</a><a href="#minusta">Minusta</a><a href="#hinnasto">Hinnasto</a><a href="#yhteys">Yhteys</a><a href="https://www.instagram.com/sallavehkasaari/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Salla Vehkasaari</span><a href="#">Takaisin ylös ↑</a></div>
    </footer>

    <dialog className="lightbox" ref={dialog} aria-label="Valokuvan katselu" onCancel={event => { event.preventDefault(); closePhoto(); }} onClick={event => { if (event.target === event.currentTarget) closePhoto(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closePhoto(); } if (event.key === "ArrowRight") movePhoto(1); if (event.key === "ArrowLeft") movePhoto(-1); }}>
      <button className="lightbox-close" onClick={closePhoto}>Sulje <span aria-hidden="true">×</span></button>
      {active !== null && <div className="lightbox-content"><img src={photos[active].src} alt={photos[active].alt} /><div className="lightbox-controls"><button onClick={() => movePhoto(-1)} aria-label="Edellinen kuva">←</button><span>{photos[active].label} &nbsp; / &nbsp; {portfolioOrder.indexOf(active) + 1} / {portfolioOrder.length}</span><button onClick={() => movePhoto(1)} aria-label="Seuraava kuva">→</button></div></div>}
    </dialog>
  </div>;
}
