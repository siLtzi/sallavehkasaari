import Home from "./Home";
import { getHomeContent } from "../lib/sanity";
import { getInstagramPosts } from "../lib/instagram";

export default async function Page() {
  const content = await getHomeContent();
  const instagramPosts = await getInstagramPosts(content.instagramFeed);
  return <Home content={content} instagramPosts={instagramPosts} />;
}
