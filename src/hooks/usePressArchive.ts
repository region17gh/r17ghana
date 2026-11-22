import { useEffect, useRef, useState } from "react";
import { filterPress, type PressArticle } from "@/lib/press";

export function usePressArchive(catalog: PressArticle[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const articles = filterPress(query, category, year, catalog);
  const years = [...new Set(catalog.map((article) => article.date.slice(0, 4)))].sort().reverse();
  const clear = () => { setQuery(""); setCategory(""); setYear(""); };
  return { query, setQuery, category, setCategory, year, setYear, articles, years, clear, heading };
}