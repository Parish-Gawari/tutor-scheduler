"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const [sessions, setSessions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  async function loadSessions() {
    const res = await fetch("/api/sessions", { cache: "no-store" });
    const data = await res.json();
    setSessions(data);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: any[] = [];
  let currentDay = 1 - firstDay;

  while (currentDay <= daysInMonth) {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay > 0 && currentDay <= daysInMonth) {
        weekDays.push(currentDay);
      } else {
        weekDays.push(null);
      }
      currentDay++;
    }
    weeks.push(weekDays);
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function formatDate(day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Calendar — {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {year}
        </h1>

        <div className="flex gap-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1 bg-slate-200 rounded"
          >
            Prev
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1 bg-slate-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 font-semibold text-center mb-4">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weeks.map((week, i) =>
          week.map((day: number | null, j: number) => {
            const dateStr = day ? formatDate(day) : null;

            const daySessions = dateStr
              ? sessions.filter((s: any) => s.date === dateStr)
              : [];

            return (
              <div
                key={`${i}-${j}`}
                className="h-28 border p-1 rounded bg-white hover:bg-slate-50 transition"
              >
                {day && <div className="font-bold text-sm mb-1">{day}</div>}

                {/* Sessions */}
                <div className="space-y-1">
                  {daySessions.map((s: any) => (
                    <Link
                      key={s._id}
                      href={`/sessions/${s._id}/edit`}
                      className="block text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5 truncate"
                    >
                      {s.title} ({s.startTime})
                    </Link>
                  ))}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
