"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { fetchStoreHoursByDate, MergedStoreInfo } from "@/lib/fetchStoreHours";

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [stores, setStores] = useState<MergedStoreInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      console.log("Fetching store hours for date:", date); // --- IGNORE ---
      const { data, error } = await fetchStoreHoursByDate(date);
      console.log("Fetched data:", data, "Error:", error); // --- IGNORE ---
      if (cancelled) return;
      if (error) {
        setError(error);
        setStores([]);
      } else {
        setStores(data);
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [date]);

  // 外部クリックでポップアップを閉じる
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        showPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(target)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showPicker]);

  const handleDateChange = (value: string) => {
    setDate(value);
    setShowPicker(false);
  };

  // format date like '10月15日(水)'
  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return `${month}月${day}日(${weekday})`;
  };

  // change date by given days without timezone issues
  const changeByDays = (days: number) => {
    const [y, m, d] = date.split("-").map((s) => Number(s));
    const dt = new Date(y, m - 1, d + days);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    setDate(`${yy}-${mm}-${dd}`);
  };

  // 判定: 指定の営業時間が「現在」営業中かどうかを返す
  const isCurrentlyOpen = (s: {
    date: string;
    start_time: string;
    end_time: string;
  }) => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      // 対象の日が今日でなければ現在は営業していない
      if (s.date !== todayStr) return false;

      const [sh, sm] = s.start_time.split(":").map((v) => Number(v));
      const [eh, em] = s.end_time.split(":").map((v) => Number(v));
      if (
        Number.isNaN(sh) ||
        Number.isNaN(sm) ||
        Number.isNaN(eh) ||
        Number.isNaN(em)
      )
        return false;

      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;

      return nowMinutes >= startMinutes && nowMinutes < endMinutes;
    } catch (e) {
      return false;
    }
  };

  // 営業中の店舗を上にしてソートした配列を作る
  const sortedStores = useMemo(() => {
    // copy
    const arr = [...stores];
    // open ones first
    arr.sort((a, b) => {
      const aOpen = isCurrentlyOpen(a) ? 1 : 0;
      const bOpen = isCurrentlyOpen(b) ? 1 : 0;
      return bOpen - aOpen;
    });
    return arr;
  }, [stores, date]);

  return (
    <main className="container page-center">
      <header className="site-logo">
        <span className="logo-blue">Kyosan</span>
        <span className="logo-green"> Eats</span>
      </header>

      <section className="date-row">
        <button className="date-nav" onClick={() => changeByDays(-1)}>
          ◀
        </button>

        <div className="date-text">{formatDate(date)}</div>

        <button className="date-nav" onClick={() => changeByDays(1)}>
          ▶
        </button>

        <button
          className="btn small"
          type="button"
          onClick={() => setShowPicker((s) => !s)}
        >
          日付を変更
        </button>
      </section>

      {showPicker && (
        <div ref={pickerRef} className="picker-popup">
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="btn small"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      <section className="cafeteria-list">
        {loading && <p className="loading">読み込み中...</p>}
        {!loading && error && <p className="error">取得エラー: {error}</p>}
        {!loading && !error && stores.length === 0 && (
          <p className="no-data">該当する店舗はありません。</p>
        )}
        {!loading && !error && stores.length > 0 && (
          <div>
            {sortedStores.map((s, idx) => {
              const openNow = isCurrentlyOpen(s);
              return (
                <div
                  className="caf-row"
                  key={`${s.shop_id}-${s.date}-${s.start_time}`}
                >
                  <div className="caf-marker">{openNow ? "🔴" : "◯"}</div>
                  <div className="caf-name">{s.store_name}</div>
                  <div className="caf-location">{s.location_name}</div>
                  <div className="caf-time">
                    {s.start_time} - {s.end_time}
                  </div>
                  {s.memo && <div className="caf-memo">{s.memo}</div>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="contact-link">
        <Link href="/contact">問合せはコチラ</Link>
      </footer>
    </main>
  );
}
