import SiteShell from "../SiteShell";
import { getBlogPosts, getHomeContent } from "../../lib/sanity";
import { formatBlogDate } from "../../lib/date";

export default async function BlogPage() {
  const [content, posts] = await Promise.all([getHomeContent(), getBlogPosts()]);
  const t = content.texts;
  return <SiteShell content={content}>
    <section className="blog-section section-wrap">
      <div className="page-intro"><p className="eyebrow">{t.occupation}</p><h1>{t.blog}</h1><p>{t.blogIntro}</p></div>
      {posts.length === 0 ? <p className="blog-empty">{t.blogEmpty}</p> : <div className="blog-grid">
        {posts.map(post => <article className="blog-card" key={post.slug}>
          <a href={`/blogi/${encodeURIComponent(post.slug)}`}>
            {post.cover?.src && <div className="blog-cover"><img src={post.cover.src} alt={post.cover.alt} loading="lazy" /></div>}
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </a>
        </article>)}
      </div>}
    </section>
  </SiteShell>;
}
