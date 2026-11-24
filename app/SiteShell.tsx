"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { HomeContent } from "../lib/content";
import SmoothScroll from "./SmoothScroll";

export default function SiteShell({ content, home = false, children }: { content: HomeContent; home?: boolean; children: ReactNode }) {
  const t = content.texts;
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const navigation = [["/portfolio", t.portfolio], ["/minusta", t.about], ["/info", t.info], ["/hinnasto", t.pricing], ["/blogi", t.blog], ["/#yhteys", t.contact]];

  useEffect(() => {
    if (!menu) return;
    const desktop = matchMedia("(min-width: 701px)");
    function closeOnDesktop() { if (desktop.matches) setMenu(false); }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenu(false); return; }
      if (event.key !== "Tab") return;
      const links = navigationRef.current?.querySelectorAll<HTMLAnchorElement>("a");
      if (!links?.length) return;
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menuButton.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === menuButton.current) { event.preventDefault(); links[0].focus(); }
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    navigationRef.current?.querySelector("a")?.focus({ preventScroll: true });
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("resize", closeOnDesktop);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", closeOnDesktop);
      window.removeEventListener("keydown", handleKey);
      if (!desktop.matches) menuButton.current?.focus({ preventScroll: true });
    };
  }, [menu]);

  return <div className="site">
    <SmoothScroll />
    <a className="skip" href="#sisalto">{t.skip}</a>
    <header className={`site-header${home ? "" : " site-header-inner"}`}>
      <a className="brand" href="/" aria-label={t.siteName} inert={menu}>
        <img src={content.symbol.src} alt="" width={500} height={500} />
      </a>
      <nav ref={navigationRef} className={menu ? "navigation is-open" : "navigation"} id="navigation" aria-label={t.navigationLabel}>
        <p className="menu-eyebrow">{t.siteName} · {t.occupation}</p>
        <div className="menu-links">{navigation.map(([href, label]) => <a href={href} key={href} onClick={() => setMenu(false)}>{label}</a>)}</div>
        {content.photos[1] && <div className="menu-visual" aria-hidden="true"><img src={content.photos[1].src} alt="" /><span>{t.location}</span></div>}
      </nav>
      <button ref={menuButton} className="menu-button" aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>
        {menu ? t.menuClose : t.menuOpen}<span className="menu-icon" aria-hidden="true"><span /><span /></span>
      </button>
    </header>
    <main id="sisalto" inert={menu}>{children}</main>
    <footer inert={menu}>
      <a href="/" className="footer-brand" aria-label={t.siteName}><img src={content.symbol.src} alt="" width={500} height={500} /><span>{t.siteName}<small>{t.occupation}</small></span></a>
      <div className="footer-links"><a href="/portfolio">{t.portfolio}</a><a href="/minusta">{t.about}</a><a href="/info">{t.info}</a><a href="/hinnasto">{t.pricing}</a><a href="/blogi">{t.blog}</a><a href="/#yhteys">{t.footerContact}</a><a href={content.instagramUrl} target="_blank" rel="noreferrer">{t.instagram} ↗</a></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {t.siteName}</span><a href="#">{t.backToTop} ↑</a></div>
    </footer>
  </div>;
}
