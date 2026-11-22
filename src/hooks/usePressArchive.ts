import { useEffect, useRef, useState } from "react";
import { filterPress, PRESS_ARTICLES } from "@/lib/press";

export function usePressArchive() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const articles = filterPress(query, category, year);
  const years = [...new Set(PRESS_ARTICLES.map((article) => article.date.slice(0, 4)))].sort().reverse();
  const clear = () => { setQuery(""); setCategory(""); setYear(""); };
  return { query, setQuery, category, setCategory, year, setYear, articles, years, clear, heading };
}