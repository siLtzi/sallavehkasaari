import type { HomeContent } from "../lib/content";

export default function About({ content, standalone = false }: { content: HomeContent; standalone?: boolean }) {
  const t = content.texts;
  return <section className="about-section" id="minusta">
    <div className="about-inner">
      <div className="about-image"><img src={content.portrait.src} alt={content.portrait.alt} loading="lazy" /></div>
      <div className="about-copy">
        <p className="eyebrow">{t.aboutEyebrow}</p>
        {standalone ? <h1>{t.aboutTitle}</h1> : <h2>{t.aboutTitle}</h2>}
        <p>{t.aboutFirst}</p>
        <p>{t.aboutSecond}</p>
        <img className="signature" src={content.signature.src} alt={content.signature.alt} width={1758} height={885} loading="lazy" />
      </div>
    </div>
  </section>;
}
