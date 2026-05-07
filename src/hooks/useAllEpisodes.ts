import { useState, useEffect } from "react";
import { useQuery } from "urql";
import { GET_EPISODES } from "../graphql/queries";

interface EpisodeItem { id: string; name: string; air_date: string; episode: string; }
interface EpisodesResponse {
  episodes: { info: { count: number; pages: number }; results: EpisodeItem[] };
}

export function useAllEpisodes() {
  const [allEpisodes, setAllEpisodes] = useState<EpisodeItem[]>([]);
  const [fetchPage, setFetchPage] = useState(1);
  const [done, setDone] = useState(false);

  const [{ data, fetching }] = useQuery<EpisodesResponse>({
    query: GET_EPISODES,
    variables: { page: fetchPage },
    pause: done,
  });

  useEffect(() => {
    if (!data) return;
    setAllEpisodes((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newOnes = data.episodes.results.filter((e) => !existingIds.has(e.id));
      return [...prev, ...newOnes];
    });
    if (fetchPage < data.episodes.info.pages) {
      setFetchPage((p) => p + 1);
    } else {
      setDone(true);
    }
  }, [data]);

  return { episodes: allEpisodes, fetching: !done || fetching };
}
