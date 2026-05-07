import { useState, useEffect } from "react";
import { useClient } from "urql";
import { GET_EPISODES } from "../graphql/queries";

interface EpisodeItem { id: string; name: string; air_date: string; episode: string; }
interface EpisodesResponse {
  episodes: { info: { count: number; pages: number }; results: EpisodeItem[] };
}

export function useAllEpisodes() {
  const client = useClient();
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const first = await client.query<EpisodesResponse>(GET_EPISODES, { page: 1 }).toPromise();
      if (cancelled || !first.data) return;

      const totalPages = first.data.episodes.info.pages;
      const results: EpisodeItem[] = [...first.data.episodes.results];

      if (totalPages > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            client.query<EpisodesResponse>(GET_EPISODES, { page: i + 2 }).toPromise()
          )
        );
        for (const r of rest) {
          if (r.data) results.push(...r.data.episodes.results);
        }
      }

      if (!cancelled) {
        setEpisodes(results.sort((a, b) => a.episode.localeCompare(b.episode)));
        setFetching(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [client]);

  return { episodes, fetching };
}
