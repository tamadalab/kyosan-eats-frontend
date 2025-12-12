import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// サーバーサイド用 Supabase クライアント
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase 環境変数が未設定です");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, content } = body;

    // バリデーション
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "内容が必要です" },
        { status: 400 }
      );
    }

    // データベースに挿入
    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          email: email.trim(),
          content: content.trim(),
          status: "未対応",
          created_at: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
        },
      ])
      .select();

    if (error) {
      console.error("Database insert error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        {
          error: "問い合わせの保存に失敗しました",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
