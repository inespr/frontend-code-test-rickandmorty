import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { CharacterCard } from "../../components/CharacterCard";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./HomePage.module.scss";

interface Props {
  onCharacterSelect?: (id: string) => void;
}

export default function HomePage({ onCharacterSelect }: Props) {
  const { page, goToPage } = usePagination();
  const { characters, info, fetching, error } = useCharacters(page);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoRow}>
            <span className={styles.logoBadge}>Rick&Morty</span>
            {info && (
              <span className={styles.infoCount}>{info.count} characters</span>
            )}
          </div>
          <p className={styles.subtitle}>
            Explore all characters from the Rick and Morty universe. Click on a character to see more details about them.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {fetching && <Loader fullPage />}
        {error && <ErrorMessage message="Failed to load characters." />}

        {!fetching && !error && info && (
          <>
            <div className={styles.infoBar}>
              <span className={styles.infoPage}>
                Page {page} of {info.pages}
              </span>
            </div>

            <ul className={styles.grid} role="list">
              {characters.map((character, i) => (
                <li key={character.id}>
                  <CharacterCard
                    character={character}
                    index={i}
                    onClick={() => onCharacterSelect?.(character.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      {!fetching && !error && info && (
        <footer className={styles.footer}>
          <Pagination
            currentPage={page}
            totalPages={info.pages}
            onPageChange={goToPage}
          />
        </footer>
      )}
    </div>
  );
}