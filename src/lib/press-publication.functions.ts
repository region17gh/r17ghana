import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { PRESS_ARTICLES } from "@/lib/press";

export const publishedPress = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("The press archive is unavailable. Please try again.");
  const client = createClient(url, key, { auth: { persistSession: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  } } });
  const result = await client.from("press_publications").select("slug").eq("state", "published");
  if (result.error) throw new Error("The press archive is unavailable. Please try again.");
  const slugs = new Set(result.data.map((row) => String(row['slug'])));
  return PRESS_ARTICLES.filter((article) => slugs.has(article.slug));
});