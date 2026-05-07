// App-level types (complement to generated graphql types)

export interface CharacterInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface Origin {
  name: string;
}

export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

export interface Character {
  id: string;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  gender: string;
  image: string;
  origin: Origin;
  episode?: Episode[];
}

export interface EpisodeCharacter {
  id: string;
  name: string;
  image: string;
  status: "Alive" | "Dead" | "unknown";
}

export interface EpisodeDetail {
  id: string;
  name: string;
  air_date: string;
  episode: string;
  characters: EpisodeCharacter[];
}

export interface EpisodeDetailResponse {
  episode: EpisodeDetail;
}

export interface CharactersResponse {
  characters: {
    info: CharacterInfo;
    results: Character[];
  };
}

export interface CharacterResponse {
  character: Character & { episode: Episode[] };
}
