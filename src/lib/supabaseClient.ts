"use client";
import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_ を優先し、なければ非公開変数名をフォールバック（ローカル開発用）
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

function assertEnv(name: string, value: string | undefined) {
  if (!value || value.trim() === "") {
    throw new Error(`Supabase環境変数が未設定: ${name} (.env.local を確認してください)`);
  }
  return value;
}

const resolvedUrl = assertEnv("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL", url);
const resolvedAnon = assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY", anon);

export const supabase = createClient(resolvedUrl, resolvedAnon);
