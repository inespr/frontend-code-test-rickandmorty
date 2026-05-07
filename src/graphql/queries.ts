export const GET_CHARACTERS = `
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
        origin {
          name
        }
      }
    }
  }
`;

export const GET_CHARACTER = `
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      image
      origin {
        name
      }
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;
