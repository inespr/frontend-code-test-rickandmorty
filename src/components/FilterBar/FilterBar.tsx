import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import styles from "./FilterBar.module.scss";

export type StatusFilter = "" | "Alive" | "Dead" | "unknown";
export type GenderFilter = "" | "Male" | "Female" | "Genderless" | "unknown";
export type SpeciesFilter = "" | "Human" | "Alien" | "Humanoid" | "Robot" | "Animal" | "Mythological Creature" | "Disease" | "Cronenberg" | "Poopybutthole";
export type OriginFilter = "" | "Earth (C-137)" | "Earth (Replacement Dimension)" | "Cronenberg Earth" | "Citadel of Ricks" | "Gazorpazorp" | "unknown";

interface Props {
  search: string;
  status: StatusFilter;
  gender: GenderFilter;
  species: SpeciesFilter;
  origin: OriginFilter;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onGenderChange: (v: GenderFilter) => void;
  onSpeciesChange: (v: SpeciesFilter) => void;
  onOriginChange: (v: OriginFilter) => void;
  className?: string;
}

export function FilterBar({
  search, status, gender, species, origin,
  onSearchChange, onStatusChange, onGenderChange, onSpeciesChange, onOriginChange,
  className,
}: Props) {
  const bp = useBreakpoint();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isMobile = bp === 'mobile';
  const showExtraFilters = !isMobile || filtersOpen;
  const hasExtraFilters = !!(gender || species || origin);

  return (
    <div className={[styles.bar, className].filter(Boolean).join(" ")}>
      <div className={styles.inputs}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} size={13} />
          <input
            type="text"
            placeholder="Search by name, species..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.input}
          />
          {search && (
            <button className={styles.clear} onClick={() => onSearchChange("")} aria-label="Clear">
              <X size={11} />
            </button>
          )}
        </div>

        {isMobile && (
          <button
            className={`${styles.filtersToggle} ${(filtersOpen || hasExtraFilters) ? styles.filtersToggleActive : ''}`}
            onClick={() => setFiltersOpen(o => !o)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={12} />
            Filters{hasExtraFilters ? ' •' : ''}
          </button>
        )}
      </div>

      <div className={styles.chips}>
        <Select
          value={status === "" ? "all" : status}
          onValueChange={(v) => onStatusChange(v === "all" ? "" : v as StatusFilter)}
        >
          <SelectTrigger className={`${styles.chip} ${status ? styles.chipActive : ""}`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Alive">Alive</SelectItem>
            <SelectItem value="Dead">Dead</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        {showExtraFilters && (
          <>
            <span className={styles.sep} />

            <Select
              value={gender === "" ? "all" : gender}
              onValueChange={(v) => onGenderChange(v === "all" ? "" : v as GenderFilter)}
            >
              <SelectTrigger className={`${styles.chip} ${gender ? styles.chipActive : ""}`}>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Genderless">Genderless</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>

            <span className={styles.sep} />

            <Select
              value={species === "" ? "all" : species}
              onValueChange={(v) => onSpeciesChange(v === "all" ? "" : v as SpeciesFilter)}
            >
              <SelectTrigger className={`${styles.chip} ${species ? styles.chipActive : ""}`}>
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All species</SelectItem>
                <SelectItem value="Human">Human</SelectItem>
                <SelectItem value="Alien">Alien</SelectItem>
                <SelectItem value="Humanoid">Humanoid</SelectItem>
                <SelectItem value="Robot">Robot</SelectItem>
                <SelectItem value="Animal">Animal</SelectItem>
                <SelectItem value="Mythological Creature">Mythological</SelectItem>
                <SelectItem value="Disease">Disease</SelectItem>
                <SelectItem value="Cronenberg">Cronenberg</SelectItem>
                <SelectItem value="Poopybutthole">Poopybutthole</SelectItem>
              </SelectContent>
            </Select>

            <span className={styles.sep} />

            <Select
              value={origin === "" ? "all" : origin}
              onValueChange={(v) => onOriginChange(v === "all" ? "" : v as OriginFilter)}
            >
              <SelectTrigger className={`${styles.chip} ${origin ? styles.chipActive : ""}`}>
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All origins</SelectItem>
                <SelectItem value="Earth (C-137)">Earth (C-137)</SelectItem>
                <SelectItem value="Earth (Replacement Dimension)">Earth (Replacement)</SelectItem>
                <SelectItem value="Cronenberg Earth">Cronenberg Earth</SelectItem>
                <SelectItem value="Citadel of Ricks">Citadel of Ricks</SelectItem>
                <SelectItem value="Gazorpazorp">Gazorpazorp</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );
}
