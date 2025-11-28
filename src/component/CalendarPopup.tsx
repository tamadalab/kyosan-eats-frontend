"use client";

import React, { useMemo, useState } from "react";
import "./calendar.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarPopup({ open, onClose, onSelect }: Props) {
  const [cursor, setCursor] = useState<Date>(new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const cells: Array<Date | null> = [];

    // previous month tail
    const prevMonthDays = firstDay;
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      cells.push(new Date(year, month - 1, prevMonthLastDate - i));
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }

    // next month head
    while (cells.length % 7 !== 0) {
      const nextDayIndex = cells.length - (prevMonthDays + daysInMonth) + 1;
      cells.push(new Date(year, month + 1, nextDayIndex));
    }

    // split into weeks
    const weeksArr: Array<Array<Date>> = [];
    for (let i = 0; i < cells.length; i += 7) {
      const week = cells.slice(i, i + 7).map((d) => (d as Date));
      weeksArr.push(week);
    }
    return weeksArr;
  }, [cursor]);

  if (!open) return null;

  const title = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  function prevMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  function handleSelect(d: Date) {
    onSelect(d);
    onClose();
  }

  const today = new Date();

  return (
    <div className="ce-overlay" role="dialog" aria-modal="true">
      <div className="ce-popup">
        <div className="ce-header">
          <button className="ce-icon-btn" onClick={prevMonth} aria-label="前の月">◀</button>
          <div className="ce-title">{title}</div>
          <button className="ce-icon-btn" onClick={nextMonth} aria-label="次の月">▶</button>
        </div>

        <div className="ce-weekdays">
          {['日','月','火','水','木','金','土'].map((w) => (
            <div key={w} className="ce-weekday">{w}</div>
          ))}
        </div>

        <div className="ce-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="ce-week">
              {week.map((d, di) => {
                const isCurrentMonth = d.getMonth() === month;
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <button
                    key={di}
                    className={`ce-day ${isCurrentMonth ? '' : 'ce-muted'} ${isToday ? 'ce-today' : ''}`}
                    onClick={() => handleSelect(d)}
                    aria-label={d.toDateString()}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="ce-footer">
          <button className="ce-close" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
