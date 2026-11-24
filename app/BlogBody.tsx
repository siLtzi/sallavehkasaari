import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { BlogPost } from "../lib/content";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => value.src && <figure><img src={value.src} alt={value.alt} loading="lazy" /></figure>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      try {
        const url = new URL(href, "https://example.com");
        if (href && ["http:", "https:", "mailto:"].includes(url.protocol)) return <a href={href}>{children}</a>;
      } catch {
        console.warn("Blogikirjoituksessa on virheellinen linkki:", href);
        return <span>{children}</span>;
      }
      console.warn("Blogikirjoituksessa on kielletty linkki:", href);
      return <span>{children}</span>;
    },
  },
};

export default function BlogBody({ body }: { body: BlogPost["body"] }) {
  return <div className="article-body"><PortableText value={body} components={components} /></div>;
}
