"use client";

import React, { useEffect, useRef, useState } from "react";
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
      const { data, error } = await fetchStoreHoursByDate(date);
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
    return () => { cancelled = true; };
  }, [date]);

  // 外部クリックでポップアップを閉じる
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (showPicker && pickerRef.current && !pickerRef.current.contains(target)) {
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

  return (
    <main className="container page-center">
      <header className="site-logo">
        <span className="logo-blue">Kyosan</span>
        <span className="logo-green"> Eats</span>
      </header>

      <section className="date-row">
        <button className="date-nav" onClick={() => changeByDays(-1)}>◀</button>

        <div className="date-text">{formatDate(date)}</div>

        <button className="date-nav" onClick={() => changeByDays(1)}>▶</button>

        <button className="btn small" type="button" onClick={() => setShowPicker((s) => !s)}>日付を変更</button>
      </section>

      {showPicker && (
        <div
          ref={pickerRef}
          className="picker-popup"
        >
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button type="button" onClick={() => setShowPicker(false)} className="btn small">閉じる</button>
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
            {stores.map((s, idx) => (
              <div className="caf-row" key={`${s.shop_id}-${s.date}-${s.start_time}`}>
                <div className="caf-marker">{idx === 0 ? "🔴" : "◯"}</div>
                <div className="caf-name">{s.store_name}</div>
                <div className="caf-location">{s.location_name}</div>
                <div className="caf-time">{s.start_time} - {s.end_time}</div>
                {s.memo && <div className="caf-memo">{s.memo}</div>}
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="contact-link">
        <Link href="/contact">問合せはコチラ</Link>
      </footer>
    </main>
  );
}
