import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogBody from "../../BlogBody";
import SiteShell from "../../SiteShell";
import { formatBlogDate } from "../../../lib/date";
import { getBlogPost, getHomeContent } from "../../../lib/sanity";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: Props) {
  const [content, post] = await Promise.all([getHomeContent(), getBlogPost((await params).slug)]);
  if (!post) notFound();
  return <SiteShell content={content}>
    <article className="blog-article section-wrap">
      <a className="text-link blog-back" href="/blogi">← {content.texts.blogBack}</a>
      <header className="page-intro">
        <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
      </header>
      {post.cover?.src && <div className="article-cover"><img src={post.cover.src} alt={post.cover.alt} /></div>}
      <BlogBody body={post.body} />
    </article>
  </SiteShell>;
}
