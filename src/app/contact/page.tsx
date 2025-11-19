"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 今はバックエンドがないのでコンソールや簡易UIで完了を示す
    console.log("問い合わせ送信（モック）", { subject, message });
    setSent(true);
    // フォームをリセット
    setSubject("");
    setMessage("");
  };

  return (
    <main className="container">
  <h1 className="contact-title">システムに関するお問い合わせ内容をご入力ください</h1>

  {sent ? (
        <>
          <p style={{ color: "green" }}>送信しました（モック）。</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => {
                setSent(false);
              }}
              className="btn"
            >
              もう一度送る
            </button>
            <Link href="/">ホームへ戻る</Link>
          </div>
        </>
        ) : (
        <form onSubmit={handleSubmit} className="form form-large">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-large"
          />

          <label htmlFor="message">内容</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={12}
            className="textarea-large"
            placeholder={"食堂に関する問い合わせはこちらまで\ne-mail: gakusei-bu-gs@star.kyoto-su.ac.jp\nTel. 075-705-1432\nFax. 075-705-1509"}
          />

          <div className="form-actions">
            <Link href="/">ホームへ戻る</Link>
            <button type="submit" className="btn">送信</button>
          </div>
        </form>
      )}
    </main>
  );
}
