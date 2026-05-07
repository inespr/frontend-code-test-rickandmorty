import { useNavigate, useLocation } from "react-router-dom";
import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { useIsMobile } from "../../hooks/useIsMobile";
import { CharacterCard } from "../../components/CharacterCard";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { page, goToPage } = usePagination();
  const { characters, info, fetching, error } = useCharacters(page);
  const isMobile = useIsMobile();
  const displayedCharacters = isMobile ? characters.slice(0, 10) : characters;

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
            Click on a character to see which episodes they have appeared in.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {fetching && <Loader fullPage />}
        {error && <ErrorMessage message="Failed to load characters." />}

        {!fetching && !error && info && (
          <ul className={styles.grid} role="list">
            {displayedCharacters.map((character, i) => (
              <li key={character.id}>
                <CharacterCard
                  character={character}
                  index={i}
                  onClick={() =>
                    navigate(`/character/${character.id}`, {
                      state: { background: location },
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      {!fetching && !error && info && (
        <footer className={styles.footer}>
          <span className={styles.infoPage}>Page {page} of {info.pages}</span>
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
