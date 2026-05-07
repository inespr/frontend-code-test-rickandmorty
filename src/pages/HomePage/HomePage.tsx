import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDebounce } from "../../hooks/useDebounce";
import { CharacterCard } from "../../components/CharacterCard";
import { FilterBar, StatusFilter } from "../../components/FilterBar";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { page, goToPage } = usePagination();
  const isMobile = useIsMobile();

  const [nameInput, setNameInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const debouncedName = useDebounce(nameInput, 400);

  useEffect(() => { goToPage(1); }, [debouncedName, status]);

  const { characters, info, fetching, error } = useCharacters(page, {
    name: debouncedName || undefined,
    status: status || undefined,
  });

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
            All the characters from the Rick and Morty universe in one place.
          </p>
          <p className={styles.subtitle}>
            Click on a character to see which episodes they have appeared in.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <FilterBar
          name={nameInput}
          status={status}
          onNameChange={setNameInput}
          onStatusChange={setStatus}
        />

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

        {!fetching && !error && info?.count === 0 && (
          <p className={styles.noResults}>No characters found.</p>
        )}
      </main>

      {!fetching && !error && info && info.pages > 1 && (
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
