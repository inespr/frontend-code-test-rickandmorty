import { Search, X, Layers } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import styles from "./FilterBar.module.scss";

export type StatusFilter = "" | "Alive" | "Dead" | "unknown";
export type GroupBy = "" | "origin" | "gender" | "status" | "species";

interface Props {
  search: string;
  status: StatusFilter;
  groupBy: GroupBy;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onGroupByChange: (v: GroupBy) => void;
  className?: string;
}

export function FilterBar({
  search,
  status,
  groupBy,
  onSearchChange,
  onStatusChange,
  onGroupByChange,
  className,
}: Props) {
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
      </div>

      <div className={styles.chips}>
        <Select
          value={status === "" ? "all" : status}
          onValueChange={(v) => onStatusChange(v === "all" ? "" : v as StatusFilter)}
        >
          <SelectTrigger className={`${styles.chip} ${!status ? styles.chipActive : ""}`}>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Alive">Alive</SelectItem>
            <SelectItem value="Dead">Dead</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        <span className={styles.sep} />

        <Select
          value={groupBy === "" ? "none" : groupBy}
          onValueChange={(v) => onGroupByChange(v === "none" ? "" : v as GroupBy)}
        >
          <SelectTrigger className={`${styles.chip} ${groupBy ? styles.chipActive : ""}`}>
            <Layers size={10} style={{ flexShrink: 0 }} />
            <SelectValue placeholder="Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No group</SelectItem>
            <SelectItem value="origin">By origin</SelectItem>
            <SelectItem value="gender">By gender</SelectItem>
            <SelectItem value="status">By status</SelectItem>
            <SelectItem value="species">By species</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
