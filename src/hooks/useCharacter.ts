import { useQuery } from "urql";
import { GET_CHARACTER } from "../graphql/queries";
import { CharacterResponse } from "../types";

export function useCharacter(id: string | undefined) {
  const [{ data, fetching, error }] = useQuery<CharacterResponse>({
    query: GET_CHARACTER,
    variables: { id },
    pause: !id,
  });

  return {
    character: data?.character,
    fetching,
    error,
  };
}