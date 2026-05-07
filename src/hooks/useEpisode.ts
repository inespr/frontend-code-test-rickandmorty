import { useQuery } from "urql";
import { GET_EPISODE } from "../graphql/queries";
import { EpisodeDetailResponse } from "../types";

export function useEpisode(id: string | null) {
  const [{ data, fetching, error }] = useQuery<EpisodeDetailResponse>({
    query: GET_EPISODE,
    variables: { id },
    pause: !id,
  });

  return {
    episode: data?.episode ?? null,
    fetching,
    error,
  };
}
