import { fetchLatestDatasets, fetchLatestReuses, fetchPosts, fetchSiteInfo } from "@/services/api";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const [siteInfo, datasetsRes, reusesRes, postsRes] = await Promise.all([
    fetchSiteInfo(),
    fetchLatestDatasets(3),
    fetchLatestReuses(3),
    fetchPosts(1, 3),
  ]);

  return (
    <HomeClient
      siteInfo={siteInfo}
      latestDatasets={datasetsRes.data || []}
      latestReuses={reusesRes.data || []}
      posts={postsRes.data || []}
    />
  );
}
