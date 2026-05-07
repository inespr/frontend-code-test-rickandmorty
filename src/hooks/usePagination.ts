import { useState, useCallback } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => p - 1), []);

  return { page, goToPage, nextPage, prevPage };
}