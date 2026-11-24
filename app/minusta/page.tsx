import About from "../About";
import SiteShell from "../SiteShell";
import { getHomeContent } from "../../lib/sanity";

export default async function AboutPage() {
  const content = await getHomeContent();
  return <SiteShell content={content}><About content={content} standalone /></SiteShell>;
}
