import { useQuery } from "urql";
import { GET_CHARACTERS } from "../graphql/queries";
import { CharactersResponse } from "../types";

export interface CharacterFilter {
  name?: string;
  status?: string;
}

export function useCharacters(page: number, filter?: CharacterFilter) {
  const hasFilter = filter && (filter.name || filter.status);

  const [{ data, fetching, error }] = useQuery<CharactersResponse>({
    query: GET_CHARACTERS,
    variables: { page, filter: hasFilter ? filter : undefined },
  });

  return {
    characters: data?.characters.results ?? [],
    info: data?.characters.info,
    fetching,
    error,
  };
}
