import { useState, useEffect } from "react";
import { useClient } from "urql";
import { GET_EPISODES } from "../graphql/queries";

interface EpisodeItem { id: string; name: string; air_date: string; episode: string; }
interface EpisodesResponse {
  episodes: { info: { count: number; pages: number }; results: EpisodeItem[] };
}

const BATCH_SIZE = 3;

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
        const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
          const batch = await Promise.all(
            remaining.slice(i, i + BATCH_SIZE).map((page) =>
              client.query<EpisodesResponse>(GET_EPISODES, { page }).toPromise()
            )
          );
          for (const r of batch) {
            if (r.data) results.push(...r.data.episodes.results);
          }
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
