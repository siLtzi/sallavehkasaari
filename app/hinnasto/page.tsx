import Pricing from "../Pricing";
import SiteShell from "../SiteShell";
import { getHomeContent } from "../../lib/sanity";

export default async function PricingPage() {
  const content = await getHomeContent();
  return <SiteShell content={content}><Pricing content={content} standalone /></SiteShell>;
}
