import SiteShell from "../SiteShell";
import { getHomeContent, getInfoContent } from "../../lib/sanity";

export default async function InfoPage() {
  const [content, info] = await Promise.all([getHomeContent(), getInfoContent()]);
  const t = content.texts;
  return <SiteShell content={content}>
    <section className="info-intro section-wrap">
      <div className="info-intro-copy">
        <p className="eyebrow">{t.occupation} · {t.location}</p>
        <h1>{t.info}</h1>
        <p>{t.experienceIntro}</p>
        <a className="text-link" href="/#yhteys">{t.contact} <span aria-hidden="true">↗</span></a>
      </div>
      {info.cover && <div className="info-cover"><img src={info.cover.src} alt={info.cover.alt} /></div>}
    </section>

    <section className="info-values">
      <div className="section-wrap info-values-inner">
        <h2>{info.valuesTitle}</h2>
        <div className="info-values-list">
          {info.values.map((value, index) => <article key={value._key}>
            <span className="info-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="info-steps section-wrap">
      <h2>{info.stepsTitle}</h2>
      <div className="info-steps-list">
        {info.steps.map(step => <article key={step._key}>
          <p className="eyebrow">{step.label}</p>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>)}
      </div>
    </section>

    <section className="info-contract">
      <div className="info-contract-inner section-wrap">
        <div className="info-contract-heading">
          <p className="eyebrow">{info.contractEyebrow}</p>
          <h2>{info.contractTitle}</h2>
        </div>
        <div className="info-contract-content">
          {info.contractSections.map(section => <details key={section._key}>
            <summary><span>{section.title}</span><span aria-hidden="true">+</span></summary>
            <div className="info-contract-text">{section.text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          </details>)}
          <p className="info-law">{info.lawText}</p>
          <p className="info-acceptance">{info.acceptanceText}</p>
        </div>
      </div>
    </section>
  </SiteShell>;
}
