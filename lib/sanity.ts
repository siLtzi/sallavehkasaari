import { createClient } from "@sanity/client";
import { cache } from "react";
import type { BlogPost, BlogPostSummary, HomeContent, InfoPageContent } from "./content";

const client = createClient({
  projectId: "tl8ba6bi",
  dataset: "production",
  apiVersion: "2026-11-19",
  useCdn: true,
  perspective: "published",
});

const postFields = `title, "slug": slug.current, publishedAt, excerpt, cover{"src": asset->url, alt}`;

export const getBlogPosts = cache(async () => client.fetch<BlogPostSummary[]>(
  `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc, _id desc){${postFields}}`,
  {},
  { next: { revalidate: 60 } },
));

export const getBlogPost = cache(async (slug: string) => client.fetch<BlogPost | null>(
  `*[_type == "blogPost" && slug.current == $slug][0]{${postFields}, body[]{..., _type == "image" => {"src": asset->url}}}`,
  { slug },
  { next: { revalidate: 60 } },
));

export const getInfoContent = cache(async () => {
  const content = await client.fetch<InfoPageContent | null>(
    `*[_id == "infoPage" && _type == "infoPage"][0]{
      cover{"src": asset->url, alt},
      valuesTitle, values[]{_key, title, text},
      stepsTitle, steps[]{_key, label, title, text},
      contractEyebrow, contractTitle, contractSections[]{_key, title, text}, lawText, acceptanceText
    }`,
    {},
    { next: { revalidate: 60 } },
  );
  if (!content) throw new Error("Sanityn julkaistu info-sivu puuttuu (infoPage).");
  return content;
});

export const getHomeContent = cache(async () => {
  const content = await client.fetch<HomeContent | null>(
    `*[_id == "homePage" && _type == "homePage"][0]{
      texts, contactTypes, instagramUrl, instagramFeed{enabled, accountId, limit},
      logo{"src": asset->url, alt},
      symbol{"src": asset->url, alt},
      signature{"src": asset->url, alt},
      portrait{"src": asset->url, alt},
      heroDesktop{"src": asset->url, alt},
      heroMobile{"src": asset->url, alt},
      photos[]{_key, "src": asset->url, alt, label},
      portraitPackages[]{_key, name, price, type, text, includes},
      weddingPackages[]{_key, name, price, type, text, includes}
    }`,
    {},
    { next: { revalidate: 60 } },
  );
  if (!content) throw new Error("Sanityn julkaistu etusivu puuttuu (homePage).");
  return content;
});
