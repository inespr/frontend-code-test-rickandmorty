import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Tv2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCharacters } from "../../hooks/useCharacters";
import { usePagination } from "../../hooks/usePagination";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDebounce } from "../../hooks/useDebounce";
import { CharacterCard } from "../../components/CharacterCard";
import { FilterBar, StatusFilter, GroupBy } from "../../components/FilterBar";
import { EpisodesModal } from "../../components/EpisodesModal/EpisodesModal";
import { Pagination } from "../../components/Pagination";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Character } from "../../types";
import styles from "./HomePage.module.scss";

const getGroupKey = (char: Character, groupBy: GroupBy): string => {
  switch (groupBy) {
    case "origin":  return char.origin.name;
    case "gender":  return char.gender;
    case "status":  return char.status;
    case "species": return char.species;
    default: return "";
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { page, goToPage } = usePagination();
  const isMobile = useIsMobile();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { goToPage(1); }, [debouncedSearch, status]);

  const { characters, info, fetching, error } = useCharacters(page, {
    name: debouncedSearch || undefined,
    status: status || undefined,
  });

  const toggleGroup = (key: string) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const displayedCharacters = isMobile ? characters.slice(0, 10) : characters;

  const grouped = groupBy
    ? displayedCharacters.reduce((acc, char) => {
        const key = getGroupKey(char, groupBy);
        if (!acc[key]) acc[key] = [];
        acc[key].push(char);
        return acc;
      }, {} as Record<string, typeof displayedCharacters>)
    : null;

  const sortedKeys = grouped ? Object.keys(grouped).sort() : [];

  const renderCard = (character: (typeof displayedCharacters)[0], i: number) => (
    <li key={character.id}>
      <CharacterCard
        character={character}
        index={i}
        onClick={() => navigate(`/character/${character.id}`, { state: { background: location } })}
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
            groupBy={groupBy}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onGroupByChange={setGroupBy}
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
          grouped ? (
            sortedKeys.map((key) => {
              const collapsed = collapsedGroups.has(key);
              return (
                <div key={key} className={styles.group}>
                  <button
                    className={styles.groupLabel}
                    onClick={() => toggleGroup(key)}
                    aria-expanded={!collapsed}
                  >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    {key}
                    <span className={styles.groupCount}>{grouped[key].length}</span>
                  </button>
                  {!collapsed && (
                    <ul className={styles.grid} role="list">
                      {grouped[key].map((char, i) => renderCard(char, i))}
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
          <Pagination currentPage={page} totalPages={info.pages} onPageChange={goToPage} />
        </footer>
      )}
      {episodesOpen && <EpisodesModal onClose={() => setEpisodesOpen(false)} />}
    </div>
  );
}
