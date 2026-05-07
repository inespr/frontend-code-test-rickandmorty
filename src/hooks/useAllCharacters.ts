import { useState, useEffect } from "react";
import { useClient } from "urql";
import { GET_CHARACTERS } from "../graphql/queries";
import { Character, CharactersResponse } from "../types";
import { CharacterFilter } from "./useCharacters";

export function useAllCharacters(filter?: CharacterFilter) {
  const client = useClient();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    setCharacters([]);

    async function fetchAll() {
      const hasFilter = filter && (filter.name || filter.status);
      const variables = { page: 1, filter: hasFilter ? filter : undefined };

      const first = await client.query<CharactersResponse>(GET_CHARACTERS, variables).toPromise();
      if (cancelled || !first.data) return;

      const totalPages = first.data.characters.info.pages;
      const results: Character[] = [...first.data.characters.results];

      if (totalPages > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            client.query<CharactersResponse>(GET_CHARACTERS, {
              page: i + 2,
              filter: hasFilter ? filter : undefined,
            }).toPromise()
          )
        );
        for (const r of rest) {
          if (r.data) results.push(...r.data.characters.results);
        }
      }

      if (!cancelled) {
        setCharacters(results);
        setFetching(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [filter?.name, filter?.status]);

  return { characters, fetching };
}
