import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Tv2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDebounce } from "../../hooks/useDebounce";
import { CharacterCard } from "../../components/CharacterCard";
import { FilterBar, StatusFilter } from "../../components/FilterBar";
import { EpisodesModal } from "../../components/EpisodesModal/EpisodesModal";
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
  const [originInput, setOriginInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [groupByOrigin, setGroupByOrigin] = useState(false);
  const [collapsedOrigins, setCollapsedOrigins] = useState<Set<string>>(new Set());
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const debouncedName = useDebounce(nameInput, 400);

  const toggleOrigin = (origin: string) =>
    setCollapsedOrigins((prev) => {
      const next = new Set(prev);
      next.has(origin) ? next.delete(origin) : next.add(origin);
      return next;
    });

  useEffect(() => { goToPage(1); }, [debouncedName, status]);

  const { characters, info, fetching, error } = useCharacters(page, {
    name: debouncedName || undefined,
    status: status || undefined,
  });

  const baseCharacters = isMobile ? characters.slice(0, 10) : characters;
  const displayedCharacters = originInput
    ? baseCharacters.filter((c) =>
        c.origin.name.toLowerCase().includes(originInput.toLowerCase())
      )
    : baseCharacters;

  const grouped = groupByOrigin
    ? displayedCharacters.reduce((acc, char) => {
        const origin = char.origin.name;
        if (!acc[origin]) acc[origin] = [];
        acc[origin].push(char);
        return acc;
      }, {} as Record<string, typeof displayedCharacters>)
    : null;

  const sortedOrigins = grouped ? Object.keys(grouped).sort() : [];

  const renderCard = (character: (typeof displayedCharacters)[0], i: number) => (
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
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <div className={styles.logoRow}>
              <img src="/favicon.svg" alt="" className={styles.logoIcon} aria-hidden="true" />
              <span className={styles.logoBadge}>Rick&Morty</span>
              {info && (
                <span className={styles.infoCount}>{info.count} characters</span>
              )}
            </div>
            <button className={styles.episodesBtn} onClick={() => setEpisodesOpen(true)}>
              <Tv2 size={13} />
              <span className={styles.episodesBtnLabel}>Episodes</span>
            </button>
          </div>
          <FilterBar
            name={nameInput}
            origin={originInput}
            status={status}
            groupByOrigin={groupByOrigin}
            onNameChange={setNameInput}
            onOriginChange={setOriginInput}
            onStatusChange={setStatus}
            onGroupByOriginChange={setGroupByOrigin}
            className={styles.headerFilter}
          />
        </div>
      </header>

      <main className={styles.main}>

        {fetching && <Loader fullPage />}
        {error && <ErrorMessage message="Failed to load characters." />}

        {!fetching && !error && info && (
          grouped ? (
            sortedOrigins.map((origin) => {
              const collapsed = collapsedOrigins.has(origin);
              return (
                <div key={origin} className={styles.group}>
                  <button
                    className={styles.groupLabel}
                    onClick={() => toggleOrigin(origin)}
                    aria-expanded={!collapsed}
                  >
                    {collapsed
                      ? <ChevronRight size={12} />
                      : <ChevronDown size={12} />
                    }
                    {origin}
                    <span className={styles.groupCount}>
                      {grouped[origin].length}
                    </span>
                  </button>
                  {!collapsed && (
                    <ul className={styles.grid} role="list">
                      {grouped[origin].map((char, i) => renderCard(char, i))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            <ul className={styles.grid} role="list">
              {displayedCharacters.map((char, i) => renderCard(char, i))}
            </ul>
          )
        )}

        {!fetching && !error && info && displayedCharacters.length === 0 && (
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
      {episodesOpen && <EpisodesModal onClose={() => setEpisodesOpen(false)} />}
    </div>
  );
}
