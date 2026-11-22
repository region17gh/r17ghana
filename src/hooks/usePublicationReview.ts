import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { loadBostonQuestions } from "@/lib/boston-questions.functions";
import { loadPublicationReview, setPressPublication, publishSelection } from "@/lib/publication-review.functions";
import { PRESS_ARTICLES } from "@/lib/press";

export function usePublicationReview() {
  const load = useServerFn(loadPublicationReview);
  const loadQuestions = useServerFn(loadBostonQuestions);
  const change = useServerFn(setPressPublication);
  const publish = useServerFn(publishSelection);
  const cache = useQueryClient();
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [articleSlugs, setArticleSlugs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["publication-review"], queryFn: async () => ({ states: await load(), questions: await loadQuestions() }), retry: false });
  const articles = PRESS_ARTICLES.map((article) => ({ ...article, state: query.data?.states.find((row) => row.slug === article.slug)?.state ?? "draft" }));
  function toggle(value: string, kind: "question" | "article") {
    const setter = kind === "question" ? setQuestionIds : setArticleSlugs;
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  }
  async function save(slug?: string, state?: "draft" | "published") {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      if (slug && state) await change({ data: { slug, state } });
      else { await publish({ data: { questionIds, articleSlugs } }); setQuestionIds([]); setArticleSlugs([]); }
      await cache.invalidateQueries(); setMessage("Publication saved.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Publication could not be saved."); }
    finally { setBusy(false); }
  }
  return { query, articles, questionIds, articleSlugs, busy, message, toggle, save };
}