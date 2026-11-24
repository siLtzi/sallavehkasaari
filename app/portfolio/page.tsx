import Gallery from "../Gallery";
import SiteShell from "../SiteShell";
import { getHomeContent } from "../../lib/sanity";

export default async function PortfolioPage() {
  const content = await getHomeContent();
  const t = content.texts;
  return <SiteShell content={content}>
    <section className="portfolio-section section-wrap">
      <div className="portfolio-intro">
        <p className="eyebrow">{t.occupation}</p>
        <h1>{t.portfolio}</h1>
        <p>{t.experienceIntro}</p>
      </div>
      <Gallery content={content} />
    </section>
  </SiteShell>;
}
