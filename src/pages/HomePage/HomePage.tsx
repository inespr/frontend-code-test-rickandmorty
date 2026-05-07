import { useState, useEffect } from "react";
import { Tv2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDebounce } from "../../hooks/useDebounce";
import { CharacterCard } from "../../components/CharacterCard";
import { FilterBar, StatusFilter, GenderFilter, SpeciesFilter, OriginFilter } from "../../components/FilterBar";
import { EpisodesModal } from "../../components/EpisodesModal/EpisodesModal";
import { Pagination } from "../../components/Pagination";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { page, goToPage } = usePagination();
  const isMobile = useIsMobile();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [gender, setGender] = useState<GenderFilter>("");
  const [species, setSpecies] = useState<SpeciesFilter>("");
  const [origin, setOrigin] = useState<OriginFilter>("");
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const debouncedOrigin = useDebounce(origin, 400);

  useEffect(() => { goToPage(1); }, [debouncedSearch, status, gender, species, debouncedOrigin]);

  const { characters, info, fetching, error } = useCharacters(page, {
    name: debouncedSearch || undefined,
    status: status || undefined,
    gender: gender || undefined,
    species: species || undefined,
  });

  const displayedCharacters = (() => {
    let result = isMobile ? characters.slice(0, 10) : characters;
    if (debouncedOrigin) {
      const q = debouncedOrigin.toLowerCase();
      result = result.filter((c) => c.origin.name.toLowerCase().includes(q));
    }
    return result;
  })();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <div className={styles.logoRow}>
              <img src="/favicon.svg" alt="" className={styles.logoIcon} aria-hidden="true" />
              <span className={styles.logoBadge}>Rick&Morty</span>
              {info && <span className={styles.infoCount}>{info.count} characters</span>}
            </div>
            <button className={styles.episodesBtn} onClick={() => setEpisodesOpen(true)}>
              <Tv2 size={13} />
              <span className={styles.episodesBtnLabel}>Episodes</span>
            </button>
          </div>
          <FilterBar
            search={search}
            status={status}
            gender={gender}
            species={species}
            origin={origin}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onGenderChange={setGender}
            onSpeciesChange={setSpecies}
            onOriginChange={setOrigin}
            className={styles.headerFilter}
          />
        </div>
      </header>

      <main className={styles.main}>
        {fetching && (
          <ul className={styles.grid} aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <li key={i}><Skeleton className={styles.skeletonCard} /></li>
            ))}
          </ul>
        )}
        {error && <ErrorMessage message="Failed to load characters." />}

        {!fetching && !error && info && (
          <ul className={styles.grid} role="list">
            {displayedCharacters.map((char, i) => (
              <li key={char.id}>
                <CharacterCard
                  character={char}
                  index={i}
                  onClick={() => navigate(`/character/${char.id}`, { state: { background: location } })}
                />
              </li>
            ))}
          </ul>
        )}

        {!fetching && !error && info && displayedCharacters.length === 0 && (
          <p className={styles.noResults}>No characters found.</p>
        )}
      </main>

      {!fetching && !error && info && info.pages > 1 && (
        <footer className={styles.footer}>
          <span className={styles.infoPage}>Page {page} of {info.pages}</span>
          <Pagination currentPage={page} totalPages={info.pages} onPageChange={goToPage} />
        </footer>
      )}
      {episodesOpen && <EpisodesModal onClose={() => setEpisodesOpen(false)} />}
    </div>
  );
}
