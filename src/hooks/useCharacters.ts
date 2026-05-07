import { useQuery } from "urql";
import { GET_CHARACTERS } from "../graphql/queries";
import { CharactersResponse } from "../types";

export function useCharacters(page: number) {
  const [{ data, fetching, error }] = useQuery<CharactersResponse>({
    query: GET_CHARACTERS,
    variables: { page },
  });

  return {
    characters: data?.characters.results ?? [],
    info: data?.characters.info,
    fetching,
    error,
  };
}