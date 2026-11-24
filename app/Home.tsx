"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowUpRight } from "lucide-react";
import Pricing from "./Pricing";
import SiteShell from "./SiteShell";
import type { HomeContent, Image, InstagramPost } from "../lib/content";

const Arrow = () => <svg viewBox="0 0 36 16" fill="none" aria-hidden="true"><path d="M1 8h32M26 1l7 7-7 7" stroke="currentColor" /></svg>;

type Chapter = { href: string; numeral: string; eyebrow: string; title: string; text: string; link: string; images: Image[] };

export default function Home({ content, instagramPosts }: { content: HomeContent; instagramPosts: InstagramPost[] }) {
  const { texts: t, photos } = content;
  const [submitted, setSubmitted] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const photo = (index: number): Image => photos.length ? photos[index % photos.length] : content.portrait;
  const chapters: Chapter[] = [
    { href: "/portfolio", numeral: "I", eyebrow: t.occupation, title: t.portfolio, text: [...new Set(photos.map(item => item.label))].join(" · "), link: t.portfolioLink, images: [photo(0), photo(1)] },
    { href: "/minusta", numeral: "II", eyebrow: t.aboutEyebrow, title: t.aboutTitle, text: t.aboutFirst, link: t.about, images: [content.portrait, photo(2)] },
    { href: "/info", numeral: "III", eyebrow: t.experienceEyebrow, title: t.experienceTitle, text: t.experienceIntro, link: t.info, images: [photo(3)] },
  ];

  useEffect(() => {
    const main = mainRef.current;
    const cursor = cursorRef.current;
    if (!main) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      SplitText.create(".intro h2", {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: self => gsap.from(self.lines, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: ".intro h2", start: "top 85%" } }),
      });
      gsap.from(".intro .eyebrow", { opacity: 0, y: 14, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".intro", start: "top 80%" } });
      gsap.fromTo(".intro-thread", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".intro-thread", start: "top 90%", end: "bottom 45%", scrub: true } });

      gsap.utils.toArray<HTMLElement>(".chapter-media").forEach(frame => {
        const image = frame.querySelector("img");
        const reveal = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 88%" } });
        reveal.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
        if (image) reveal.fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: "expo.out", clearProps: "transform" }, 0.1);
        gsap.fromTo(frame.querySelector(".chapter-parallax"), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>(".chapter-media--detail").forEach(frame => {
        gsap.fromTo(frame, { y: 70 }, { y: -70, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>(".chapter-copy").forEach(copy => {
        gsap.from(copy.children, { opacity: 0, y: 26, duration: 1.1, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: copy, start: "top 85%" } });
      });
      gsap.utils.toArray<HTMLElement>(".prices-heading > .eyebrow, .prices-heading > h2, .prices-heading > p, .contact-heading, .instagram-inner").forEach(element => {
        gsap.from(element, { opacity: 0, y: 18, duration: 1, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 90%" } });
      });
    }, main);

    media.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      if (!cursor) return;
      const moveX = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3" });
      const moveY = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3" });
      const frames = main.querySelectorAll<HTMLElement>(".chapter-media");
      const move = (event: PointerEvent) => { moveX(event.clientX); moveY(event.clientY); };
      const show = () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
      const hide = () => gsap.to(cursor, { scale: 0.4, opacity: 0, duration: 0.35, ease: "power3.out" });
      window.addEventListener("pointermove", move);
      frames.forEach(frame => { frame.addEventListener("pointerenter", show); frame.addEventListener("pointerleave", hide); });
      return () => {
        window.removeEventListener("pointermove", move);
        frames.forEach(frame => { frame.removeEventListener("pointerenter", show); frame.removeEventListener("pointerleave", hide); });
      };
    });

    return () => media.revert();
  }, []);

  return <SiteShell content={content} home>
    <div ref={mainRef}>
      <section className="hero" aria-label={t.heroTitle}>
        <div className="hero-art">
          <picture className="hero-fullscreen">
            <source media="(min-width: 701px)" srcSet={content.heroDesktop.src} />
            <img src={content.heroMobile.src} alt={content.heroMobile.alt} fetchPriority="high" />
          </picture>
          <img className="hero-logo" src={content.signature.src} alt="" width={1758} height={885} />
        </div>
        <div className="hero-bottom">
          <h1>{t.heroTitle}</h1>
          <p>{t.location}</p>
        </div>
      </section>

      <section className="intro" aria-labelledby="intro-heading">
        <p className="eyebrow">{t.occupation} <span aria-hidden="true">—</span> {t.location}</p>
        <h2 id="intro-heading">{t.introStatement}</h2>
        <span className="intro-thread" aria-hidden="true" />
      </section>

      <div className="chapters">
        {chapters.map((chapter, index) => <article className={`chapter chapter--${index + 1}`} key={chapter.href} aria-labelledby={`chapter-${index + 1}`}>
          {chapter.images.map((image, imageIndex) => <a key={imageIndex} className={`chapter-media chapter-media--${imageIndex ? "detail" : "main"}`} href={chapter.href} tabIndex={-1} aria-hidden="true">
            <span className="chapter-parallax"><img src={image.src} alt="" loading="lazy" /></span>
          </a>)}
          <div className="chapter-copy">
            <span className="chapter-numeral" aria-hidden="true">{chapter.numeral}</span>
            <p className="eyebrow">{chapter.eyebrow}</p>
            <h3 id={`chapter-${index + 1}`}>{chapter.title}</h3>
            <p>{chapter.text}</p>
            <a className="chapter-link" href={chapter.href}>{chapter.link} <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </article>)}
      </div>
      <div className="chapter-cursor" ref={cursorRef} aria-hidden="true"><ArrowUpRight /></div>

      <section className="instagram-section" aria-label={t.instagram}>
        <div className="instagram-inner section-wrap">
          <span className="instagram-mark" aria-hidden="true">◎</span>
          <h2>{t.instagram}</h2>
          {instagramPosts.length > 0 && <div className="instagram-grid">
            {instagramPosts.map((post, index) => <a key={post.id} href={post.permalink} target="_blank" rel="noreferrer" aria-label={`${t.instagram} ${index + 1}${post.alt ? `: ${post.alt}` : ""}`}>
              <img src={post.imageUrl} alt={post.alt} loading="lazy" />
            </a>)}
          </div>}
          <a className="text-link" href={content.instagramUrl} target="_blank" rel="noreferrer">{t.instagram} <Arrow /></a>
        </div>
      </section>

      <Pricing content={content} />

      <section className="contact-section" id="yhteys">
        <div className="contact-inner">
          <div className="contact-heading"><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contact}</h2><p>{t.contactIntro}</p><span className="contact-detail">{t.location}</span></div>
          <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            <div className="form-pair"><label>{t.nameLabel}<input name="name" autoComplete="name" required /></label><label>{t.emailLabel}<input name="email" type="email" autoComplete="email" required /></label></div>
            <label>{t.typeLabel}<select name="type" defaultValue="" required><option disabled value="">{t.typePlaceholder}</option>{content.contactTypes.map((type, index) => <option key={index}>{type}</option>)}</select></label>
            <label>{t.messageLabel}<textarea name="message" rows={3} placeholder={t.messagePlaceholder} required /></label>
            <div className="form-end"><small>{t.formNotice}</small><button type="submit">{t.formSubmit} <Arrow /></button></div>
            <p className="form-status" role="status">{submitted ? t.formSuccess : ""}</p>
          </form>
        </div>
      </section>

    </div>
  </SiteShell>;
}
