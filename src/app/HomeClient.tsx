"use client";

import React, { useMemo, useState } from "react";
import {
  CATEGORIES,
  EventItem,
  FAQ_ITEMS,
  MARQUEE_ITEMS,
  SAMPLE_EVENTS,
} from "./data";

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "Food & Drinks":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="2" x2="8" y2="22" />
          <line x1="5" y1="5" x2="8" y2="9" />
          <line x1="11" y1="5" x2="8" y2="9" />
          <path d="M15 2c2 0 3 2 3 5v2h-3v13" />
        </svg>
      );
    case "Music":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case "Games":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="11" rx="5" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Arts":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="9" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="15" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Sports":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="15" cy="4" r="2" />
          <path d="M5 21l5-7 3 3 3.5-5.5" />
          <path d="M4 10l4.5-5.5 4.5 2.5 2.5-4" />
        </svg>
      );
    case "Shopping":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L4 8h16l-2-6H6z" />
          <rect x="2" y="8" width="20" height="14" rx="2" />
          <path d="M9 13c0 1.7 1.3 3 3 3s3-1.3 3-3" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
  }
}

function getOrdinalSuffix(n: number) {
  const s = ["TH", "ST", "ND", "RD"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default function HomeClient({
  initialEvents = SAMPLE_EVENTS,
}: {
  initialEvents?: EventItem[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeDayOffset, setActiveDayOffset] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [hiddenEvents, setHiddenEvents] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Build 14 days starting from today
  const days = useMemo(() => {
    const base = new Date();
    const monthsShort = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const monthsLong = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];
    const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const daysLong = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    return Array.from({ length: 14 }, (_, idx) => {
      const d = new Date(base);
      d.setDate(base.getDate() + idx);
      const dayNum = d.getDate();
      const iso = d.toISOString().split("T")[0];
      return {
        offset: idx,
        iso,
        mon: monthsShort[d.getMonth()],
        name: daysShort[d.getDay()],
        num: dayNum,
        longHeader: `${daysLong[d.getDay()]}, ${monthsLong[d.getMonth()]} ${dayNum}`,
        ordinal: getOrdinalSuffix(dayNum),
      };
    });
  }, []);

  const visiblePool = useMemo(() => {
    return initialEvents.filter((ev) => !hiddenEvents[ev.id]);
  }, [initialEvents, hiddenEvents]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    visiblePool.forEach((ev) => {
      map[ev.category] = (map[ev.category] || 0) + 1;
    });
    return map;
  }, [visiblePool]);

  const filteredEvents = useMemo(() => {
    return visiblePool.filter((ev) => {
      if (activeCategory !== "all" && ev.category !== activeCategory) {
        return false;
      }
      if (ev.dayOffset !== activeDayOffset) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay =
          `${ev.title} ${ev.venue} ${ev.city} ${ev.zip} ${ev.category} ${ev.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [visiblePool, activeCategory, activeDayOffset, searchQuery]);

  const activeDayObj = days[activeDayOffset] || days[0];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hideEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenEvents((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div>
      {/* ─── SECTION 1: HEADER ─────────────────────────────────────────────── */}
      <div className="header-wrapper">
        <header className="header">
          <div className="header__left">
            <button
              type="button"
              className="header__menu-btn"
              aria-label="Menu"
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="22" height="20" viewBox="0 0 18 16" fill="none">
                <path
                  d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5"
                  fill="currentColor"
                />
              </svg>
            </button>

            <a href="/" className="header__heading-link">
              <img
                src="/whats-poppin.png"
                alt="What's Poppin"
                className="header__heading-logo"
              />
            </a>

            <nav className="header__inline-menu">
              <ul className="list-menu--inline" role="list">
                <li>
                  <a href="/" className="header__menu-item active">
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="header__menu-item">
                    <span>My Do2Nite</span>
                  </a>
                </li>
                <li>
                  <a href="#venues" className="header__menu-item">
                    <span>Venues</span>
                  </a>
                </li>
                <li>
                  <a href="#add-venue" className="header__menu-item">
                    <span>Add Your Venue</span>
                  </a>
                </li>
                <li>
                  <a href="#about" className="header__menu-item">
                    <span>About</span>
                  </a>
                </li>
                <li>
                  <a href="#shop" className="header__menu-item">
                    <span>Shop</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header__icons">
            <a
              href="#my-do2nite"
              className="header__icon--account"
              aria-label="Log in"
            >
              <svg width="20" height="21" viewBox="0 0 18 19" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15M9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        >
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong style={{ color: "#fff", fontSize: "18px" }}>
                  Do2Nite
                </strong>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8A97D6",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <ul className="mobile-drawer__list">
                <li>
                  <a href="/" className="mobile-drawer__item">
                    Home Calendar
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    My Do2Nite
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Favorited Events
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Friends
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Hot Potato
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Favorite Venues
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Preferences
                  </a>
                </li>
                <li>
                  <a href="#my-do2nite" className="mobile-drawer__item">
                    Orders
                  </a>
                </li>
                <li className="d2n-drawer-spacer" />
                <li>
                  <a href="#venues" className="mobile-drawer__item">
                    Venues
                  </a>
                </li>
                <li>
                  <a href="#add-venue" className="mobile-drawer__item">
                    Add Your Venue
                  </a>
                </li>
                <li className="d2n-drawer-spacer" />
                <li>
                  <a href="#faq" className="mobile-drawer__item">
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a href="#about" className="mobile-drawer__item">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* ─── SECTION 2: DO2NITE CALENDAR ─────────────────────────────────── */}
        <div id="d2c-wrap">
          <div className="d2c-sticky-nav">
            {/* Category Filter Bar */}
            <div className="d2n-scroll-cue">
              <div className="d2c-filter-bar">
                <div className="d2c-filter-inner">
                  <div
                    role="button"
                    tabIndex={0}
                    className={`d2c-pill ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => setActiveCategory("all")}
                  >
                    All Events{" "}
                    <span className="d2c-pill-count">{visiblePool.length}</span>
                  </div>
                  {CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat.name] || 0;
                    const isActive = activeCategory === cat.name;
                    return (
                      <div
                        key={cat.name}
                        role="button"
                        tabIndex={0}
                        data-cat=""
                        className={`d2c-pill ${isActive ? "active" : ""}`}
                        style={{
                          color: isActive ? "#fff" : cat.color,
                          borderColor: cat.color,
                          background: isActive
                            ? `rgba(${cat.rgb}, 0.22)`
                            : `rgba(${cat.rgb}, 0.08)`,
                        }}
                        onClick={() => {
                          setActiveCategory(cat.name);
                          // Auto-jump to soonest day with an event in this category if current day has none
                          const hasOnCurrent = visiblePool.some(
                            (e) =>
                              e.category === cat.name &&
                              e.dayOffset === activeDayOffset
                          );
                          if (!hasOnCurrent) {
                            const firstMatch = visiblePool.find(
                              (e) => e.category === cat.name
                            );
                            if (firstMatch) {
                              setActiveDayOffset(firstMatch.dayOffset);
                            }
                          }
                        }}
                      >
                        {cat.name}{" "}
                        <span className="d2c-pill-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Day Navigation Bar */}
            <div className="d2n-scroll-cue">
              <div className="d2c-daynav-outer">
                <div className="d2c-daynav">
                  {days.map((d) => {
                    const dayColors = Array.from(
                      new Set(
                        visiblePool
                          .filter(
                            (ev) =>
                              ev.dayOffset === d.offset &&
                              (activeCategory === "all" ||
                                ev.category === activeCategory)
                          )
                          .map((ev) => ev.categoryColor)
                      )
                    );
                    const isToday = d.offset === 0;
                    const isActive = d.offset === activeDayOffset;
                    return (
                      <div
                        key={d.iso}
                        role="button"
                        tabIndex={0}
                        className={`d2c-day-btn ${isToday ? "today" : ""} ${
                          isActive ? "active" : ""
                        }`}
                        style={{
                          opacity: dayColors.length === 0 && !isActive ? 0.35 : 1,
                        }}
                        onClick={() => setActiveDayOffset(d.offset)}
                      >
                        <span className="d2c-day-mon">{d.mon}</span>
                        <span className="d2c-day-name">{d.name}</span>
                        <span className="d2c-day-num">{d.num}</span>
                        <span className="d2c-day-dots">
                          {dayColors.slice(0, 3).map((c, idx) => (
                            <span
                              key={idx}
                              className="d2c-day-dot"
                              style={{ background: c }}
                            />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Search Row: Zip/Event Name + Jump-to-Date */}
          <div className="d2c-zip-bar">
            <div className="d2c-search-row">
              <div className="d2c-zip-field">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="d2c-zip-input"
                  placeholder="Search by zip code or event name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="d2c-zip-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="d2c-zip-field">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date"
                  aria-label="Jump to a date"
                  className="d2c-zip-input"
                  value={activeDayObj.iso}
                  onChange={(e) => {
                    const idx = days.findIndex((d) => d.iso === e.target.value);
                    if (idx !== -1) setActiveDayOffset(idx);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Active Date Header */}
          <div className="d2c-date-header-wrap">
            <div className="d2c-date-header">
              {activeDayObj.longHeader}
              <sup style={{ fontSize: "0.62em", marginLeft: "2px" }}>
                {activeDayObj.ordinal}
              </sup>
            </div>
          </div>

          {/* Events Body */}
          <div className="d2c-body">
            <p className="d2c-disclaimer">
              Events are subject to change. Please confirm event details before
              heading out.
            </p>

            {filteredEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "#8A97D6",
                  fontSize: "17px",
                }}
              >
                <p>No events matching your current filter for this day.</p>
                {Object.keys(hiddenEvents).length > 0 && (
                  <button
                    type="button"
                    className="d2c-card-view-btn"
                    style={{ margin: "12px auto 0" }}
                    onClick={() => setHiddenEvents({})}
                  >
                    Restore Hidden Events
                  </button>
                )}
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const isFaved = !!favorites[ev.id];
                return (
                  <div
                    key={ev.id}
                    className="d2c-ev-wrap"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    {/* Left Column: Time + Heart/Hide + More */}
                    <div className="d2c-ev-left">
                      <div className="d2c-ev-time">
                        <span className="d2c-ev-time-start">{ev.startTime}</span>
                        <span className="d2c-ev-time-end">{ev.endTime}</span>
                      </div>

                      <div className="d2c-ev-btns">
                        <button
                          type="button"
                          className={`d2c-heart-btn ${isFaved ? "active" : ""}`}
                          aria-label="Favorite"
                          onClick={(e) => toggleFavorite(ev.id, e)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="17"
                            height="17"
                            fill={isFaved ? "#FF3B6A" : "none"}
                            stroke={isFaved ? "#FF3B6A" : "currentColor"}
                            strokeWidth="2"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="d2c-hide-btn"
                          aria-label="Hide event"
                          onClick={(e) => hideEvent(ev.id, e)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="17"
                            height="17"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                        </button>
                      </div>

                      <button
                        type="button"
                        className="d2c-card-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                      >
                        More…
                      </button>
                    </div>

                    {/* Right Card Box */}
                    <div
                      className="d2c-card"
                      style={{
                        borderColor: ev.categoryColor,
                        background: `${ev.categoryColor}14`,
                        boxShadow: `0 0 18px ${ev.categoryColor}33, 0 0 40px ${ev.categoryColor}14`,
                      }}
                    >
                      <div
                        className="d2c-card-icon"
                        style={{ color: ev.categoryColor }}
                      >
                        <CategoryIcon category={ev.category} />
                      </div>

                      <div className="d2c-card-body">
                        <p
                          className="d2c-card-title"
                          style={{ color: ev.categoryColor }}
                        >
                          {ev.title}
                        </p>
                        <p
                          className="d2c-card-venue"
                          style={{ color: ev.venueTypeColor }}
                        >
                          {ev.venue}
                        </p>
                        <p className="d2c-card-dist">
                          <svg
                            style={{
                              verticalAlign: "-2px",
                              marginRight: "4px",
                            }}
                            width="13"
                            height="16"
                            viewBox="0 0 234.3 279.8"
                            fill="#8A97D6"
                            fillRule="evenodd"
                          >
                            <path d="M117.1,0C52.4,0,0,52.4,0,117.1s36.9,99.9,86.9,113.2c3.4,4.8,23.5,49.5,30.4,49.5s27-44.8,30.4-49.6c49.9-13.4,86.6-59,86.6-113.1S181.8,0,117.1,0Z" />
                          </svg>
                          {ev.distance ? `${ev.distance} · ` : ""}
                          {ev.city}, {ev.state}
                        </p>
                        <p className="d2c-card-desc">{ev.description}</p>
                      </div>

                      <div className="d2c-card-right">
                        {ev.tags.map((tag) => (
                          <span key={tag} className="d2c-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Event Modal */}
          {selectedEvent && (
            <div
              className="d2c-overlay"
              onClick={() => setSelectedEvent(null)}
            >
              <div
                className="d2c-modal"
                style={{ borderColor: selectedEvent.categoryColor }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="d2c-modal-close"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: selectedEvent.categoryColor,
                    marginBottom: "6px",
                  }}
                >
                  {selectedEvent.category}
                </div>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: selectedEvent.categoryColor,
                    paddingRight: "36px",
                  }}
                >
                  {selectedEvent.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "17px",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {selectedEvent.venue}
                </p>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "16px",
                    color: "#8A97D6",
                  }}
                >
                  {selectedEvent.address}, {selectedEvent.city},{" "}
                  {selectedEvent.state} {selectedEvent.zip} ({selectedEvent.distance})
                </p>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(138,151,214,0.2)",
                    margin: "12px 0",
                  }}
                />
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "16px",
                    color: "#8A97D6",
                  }}
                >
                  <strong style={{ color: "#fff" }}>Time:</strong>{" "}
                  {selectedEvent.startTime} – {selectedEvent.endTime}
                </p>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "17px",
                    lineHeight: 1.5,
                    color: "#fff",
                  }}
                >
                  {selectedEvent.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedEvent.tags.map((tag) => (
                    <span key={tag} className="d2c-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── SECTION 3: MARQUEE HERO (DO 2 NITE) ─────────────────────────── */}
        <section className="d2n-mq">
          <div className="d2n-mq-hero">
            <div
              aria-hidden="true"
              className="d2n-mq-map"
              style={{
                backgroundImage:
                  "url('https://cdn.shopify.com/s/files/1/0809/7405/3634/files/map-kenosha-wi.svg?v=1787035316')",
              }}
            />
            <div className="d2n-mq-inner">
              <div className="d2n-mq-lockup">
                <p aria-hidden="true" className="d2n-mq-scribble">
                  something!!
                </p>
                <h1 className="d2n-mq-h1">
                  DO{" "}
                  <svg
                    aria-hidden="true"
                    className="d2n-mq-caret"
                    fill="none"
                    viewBox="0 0 28 44"
                  >
                    <path
                      d="M3 40 L14 4 L25 42"
                      stroke="#FF2A2A"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="5.5"
                    />
                  </svg>
                  <span className="d2n-two">2</span> NITE
                </h1>
              </div>
              <h2 className="d2n-mq-sub">
                Do2Nite is the free local event calendar that shows you what to
                do near you tonight or this weekend. Find live music, trivia,
                and food specials without following pages or digging through
                social media feeds.
              </h2>
            </div>

            {/* Scrolling Category Ticker */}
            <div aria-hidden="true" className="d2n-mq-ticker">
              <div className="d2n-mq-track">
                {[0, 1].map((halfIdx) => (
                  <div key={halfIdx} className="d2n-mq-half">
                    {MARQUEE_ITEMS.map((item, idx) => (
                      <span
                        key={`${halfIdx}-${idx}`}
                        className="d2n-mq-item"
                        style={
                          { "--d2n-mq-c": item.color } as React.CSSProperties
                        }
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Step Boxes */}
            <div className="d2n-mq-steps">
              <div className="d2n-mq-step d2n-mq-step-1">
                <span aria-hidden="true" className="d2n-mq-ghost">
                  1
                </span>
                <p className="d2n-mq-eyebrow">Check the Calendar</p>
                <p className="d2n-mq-body">
                  Find the events in your area that are coming up soon in one
                  easy spot.
                </p>
              </div>
              <div className="d2n-mq-step d2n-mq-step-2">
                <span aria-hidden="true" className="d2n-mq-ghost">
                  2
                </span>
                <p className="d2n-mq-eyebrow">Scroll &amp; Tap</p>
                <p className="d2n-mq-body">
                  A quick tap on any event will give you all of its details.
                </p>
              </div>
              <div className="d2n-mq-step d2n-mq-step-3">
                <span aria-hidden="true" className="d2n-mq-ghost">
                  3
                </span>
                <p className="d2n-mq-eyebrow">Go Out 2Nite</p>
                <p className="d2n-mq-body">
                  Attend the event and get out of the house for once!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: MY DO2NITE HOME CTA ──────────────────────────────── */}
        <section id="my-do2nite" className="d2my">
          <div className="d2my-inner">
            <div className="d2my-copy">
              <h2 className="d2my-h">
                Done staring at the wall?
                <br />
                <span className="d2my-h-accent">Do something 2Nite!</span>
              </h2>
              <p className="d2my-p">
                Looking at the calendar gets you off the couch, but a free
                Do2Nite profile lets you bookmark your favorite spots and save
                the events you don’t want to miss.
              </p>
              <ul className="d2my-perks" role="list">
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    style={{ color: "#FF9F00" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                  Play Hot Potato in person
                </li>
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="8" width="18" height="4" rx="1" />
                    <path d="M12 8v13" />
                    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                  </svg>
                  Turn points into free swag
                </li>
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  See what friends are doing
                </li>
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  Save events to your list
                </li>
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Follow your regular spots
                </li>
                <li>
                  <svg
                    aria-hidden="true"
                    className="d2my-ico"
                    viewBox="0 0 24 24"
                  >
                    <line x1="21" y1="4" x2="14" y2="4" />
                    <line x1="10" y1="4" x2="3" y2="4" />
                    <line x1="21" y1="12" x2="12" y2="12" />
                    <line x1="8" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="20" x2="16" y2="20" />
                    <line x1="12" y1="20" x2="3" y2="20" />
                    <line x1="14" y1="2" x2="14" y2="6" />
                    <line x1="8" y1="10" x2="8" y2="14" />
                    <line x1="16" y1="18" x2="16" y2="22" />
                  </svg>
                  Filter by category
                </li>
              </ul>

              <div className="d2my-cta">
                <a href="#my-do2nite" className="d2my-btn d2my-btn-primary">
                  Create Free Profile
                </a>
                <a href="#my-do2nite" className="d2my-btn d2my-btn-secondary">
                  Log In
                </a>
              </div>
              <p className="d2my-proof">
                Free, always; no card · set up in under a minute
              </p>
            </div>

            <div aria-hidden="true" className="d2my-visual">
              <div className="d2my-glow" />
              <div className="d2my-phone-wrap">
                <div className="d2my-phone">
                  <div className="d2my-screen">
                    <img
                      src="https://do2nite.com/cdn/shop/t/29/assets/d2n-my-do2nite-phone.jpg?v=170015234195365518531792902337"
                      alt="My Do2Nite Mobile Preview"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: VENUE SIGNUP BANNER ──────────────────────────────── */}
        <section id="add-venue" className="rich-text">
          <div className="rich-text__wrapper">
            <h2 className="rich-text__heading">
              Run a venue? Get found 2Nite.
            </h2>
            <div className="rich-text__text">
              <p>
                List your bar, restaurant, or event space and reach locals right
                when they’re deciding where to step out. From $1 a day; no
                contract, cancel anytime.
              </p>
            </div>
            <div>
              <a href="#add-venue" className="rich-text__button">
                Add Your Venue
              </a>
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: VISITOR FAQ & ABOUT DO2NITE ──────────────────────── */}
        <div id="faq" className="d2nfaq-wrap">
          <div className="d2nfaq-inner">
            <p className="d2nfaq-eyebrow">Visitor FAQ</p>
            <h2 className="d2nfaq-heading">What people ask about Do2Nite</h2>

            <div className="d2n-faq">
              {FAQ_ITEMS.map((item, idx) => (
                <details key={idx} className="d2n-faq-item">
                  <summary className="d2n-faq-q">{item.q}</summary>
                  <div className="d2n-faq-a">{item.a}</div>
                </details>
              ))}
            </div>

            <div id="about" className="d2naeo">
              <h2>
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  fillRule="evenodd"
                  height="22"
                  viewBox="0 0 234.3 279.8"
                  width="18"
                >
                  <path d="M117.1,0C52.4,0,0,52.4,0,117.1s36.9,99.9,86.9,113.2c3.4,4.8,23.5,49.5,30.4,49.5s27-44.8,30.4-49.6c49.9-13.4,86.6-59,86.6-113.1S181.8,0,117.1,0ZM160.7,162.2c0,1.2-.4,2.1-1.1,2.9-.7.7-1.7,1.1-2.9,1.1h-78.8c-1.2,0-2.1-.4-2.9-1.1-.7-.7-1.1-1.7-1.1-2.9v-9.6c0-.8.2-2,.7-3.4s1.6-2.8,3.3-4.2c0,0,35-31.8,39.9-36,4.8-4.1,8.4-7.9,10.7-11.3,2.3-3.4,3.5-6.7,3.5-9.9s-1.1-7.6-3.4-10.3c-2.3-2.7-6-4.1-11.1-4.1s-6.2.7-8.5,2.1c-2.3,1.4-4.1,3.3-5.3,5.7-1.3,2.3-2.1,4.9-2.5,7.6-.3,1.4-1,2.3-2,2.9-1,.5-2,.8-3.1.8h-16.9c-1.1,0-1.9-.3-2.5-1-.6-.7-1-1.5-1-2.3.1-4.9,1.1-9.5,3.1-13.8,2-4.3,4.7-8.2,8.4-11.6,3.6-3.4,8-6.1,13.1-8,5.1-2,10.9-2.9,17.3-2.9s16.4,1.5,22.4,4.4c6,2.9,10.6,6.9,13.7,12,3.1,5.1,4.6,11,4.6,17.7s-1,9.8-3.1,14.2c-2.1,4.4-5.1,8.5-9,12.5-3.9,4-32.8,31.1-32.8,31.1h43.3c1.2,0,2.1.4,2.9,1.1.7.7,1.1,1.7,1.1,2.9v13.5Z" />
                </svg>
                About Do2Nite
              </h2>
              <h3>What Do2Nite is</h3>
              <p>
                Do2Nite is a free local events calendar built to answer one
                question: what can I do tonight? Venues, artists, and
                entertainers list what they have going on; visitors browse it in
                seconds with no algorithm deciding what they see, and a mobile
                app is coming soon. Do2Nite is based in Kenosha, Wisconsin,
                launched in October 2026, and is open to venues and visitors
                across the United States, with its first live markets in
                southeastern Wisconsin.
              </p>
              <h3>How the calendar works</h3>
              <p>
                Share your device location or enter a city or ZIP code, pick a
                distance radius, and the calendar shows every listed event near
                you, day by day, sorted by start time. Every event is
                color-coded into one of 18 categories, from Food &amp; Drinks
                and Music to Sports, Arts, and Family, and shows its time,
                venue, distance, and practical tags like free admission, age
                limits, and family-friendly. Events that have ended drop off
                automatically, so the list always reflects what you can still
                make 2Nite.
              </p>
              <h3>What a free My Do2Nite profile adds</h3>
              <p>
                A free My Do2Nite profile lets you favorite events and venues so
                they stay one tap away, hide what you don’t want to see, tune
                the calendar to the categories you care about, earn points you
                can spend on Do2Nite merch, add friends, and check in at
                participating venues; some of which run Hot Potato, a
                pass-the-phone game with prizes the venue sets.
              </p>
              <h3>For venues, artists &amp; entertainers</h3>
              <p>
                Any venue, artist, entertainer, organization, or event-based
                business in the United States can list on Do2Nite with a paid
                subscription; unlimited events, a public venue page, and equal
                visibility with every other venue. There is no pay-to-win
                placement on the calendar. Plans run from $60 month to month
                down to $360 a year; about $1 a day.
              </p>
              <h3>Where Do2Nite is live</h3>
              <p>
                Do2Nite is open across the United States and grows venue by
                venue. It started in Kenosha, Wisconsin, where the calendar runs
                deepest, and reaches across southeast Wisconsin from Racine to
                Milwaukee, with early footholds like Ann Arbor, Michigan. City
                guides:{" "}
                <a href="#kenosha">things to do in Kenosha, WI</a> and{" "}
                <a href="#ann-arbor">things to do in Ann Arbor, MI</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── SECTION 7: FOOTER ─────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__top">
          <a href="#my-do2nite" className="d2n-footer-my-btn">
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.9"
              style={{ width: 18, height: 18 }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span>My Do2Nite</span>
          </a>

          <a href="/" className="d2n-footer-cal-btn">
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              style={{ width: 18, height: 18 }}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Calendar</span>
          </a>

          <ul className="footer__list-social" role="list">
            <li>
              <a
                className="list-social__link"
                href="https://www.facebook.com/do2nite"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 20 20">
                  <path d="M18 10.049C18 5.603 14.419 2 10 2s-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719v-2.328h2.03V8.275c0-2.017 1.195-3.132 3.023-3.132.874 0 1.79.158 1.79.158v1.98h-1.009c-.994 0-1.303.621-1.303 1.258v1.51h2.219l-.355 2.326H11.25V18c3.825-.604 6.75-3.933 6.75-7.951" />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="list-social__link"
                href="https://www.instagram.com/do2nite/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.195.164-1.487.273a2.4 2.4 0 0 0-.912.593 2.5 2.5 0 0 0-.602.922c-.11.282-.238.702-.274 1.486-.046.84-.046 1.095-.046 3.23s.01 2.39.046 3.229c.004.51.097 1.016.274 1.495.145.365.319.639.602.913.282.282.538.456.92.602.474.176.974.268 1.479.273.848.046 1.103.046 3.238.046s2.39-.01 3.23-.046c.784-.036 1.203-.164 1.486-.273.374-.146.648-.329.921-.602.283-.283.447-.548.602-.922.177-.476.27-.979.274-1.486.037-.84.046-1.095.046-3.23s-.01-2.39-.055-3.229c-.027-.784-.164-1.204-.274-1.495a2.4 2.4 0 0 0-.593-.913 2.6 2.6 0 0 0-.92-.602c-.284-.11-.703-.237-1.488-.273ZM6.697 2.05c.857-.036 1.131-.045 3.302-.045a63 63 0 0 1 3.302.045c.664.014 1.321.14 1.943.374a4 4 0 0 1 1.414.922c.41.397.728.88.93 1.414.23.622.354 1.279.365 1.942C18 7.56 18 7.824 18 10.005c0 2.17-.01 2.444-.046 3.292-.036.858-.173 1.442-.374 1.943-.2.53-.474.976-.92 1.423a3.9 3.9 0 0 1-1.415.922c-.51.191-1.095.337-1.943.374-.857.036-1.122.045-3.302.045-2.171 0-2.445-.009-3.302-.055-.849-.027-1.432-.164-1.943-.364a4.15 4.15 0 0 1-1.414-.922 4.1 4.1 0 0 1-.93-1.423c-.183-.51-.329-1.085-.365-1.943C2.009 12.45 2 12.167 2 10.004c0-2.161 0-2.435.055-3.302.027-.848.164-1.432.365-1.942a4.4 4.4 0 0 1 .92-1.414 4.2 4.2 0 0 1 1.415-.93c.51-.183 1.094-.33 1.943-.366Zm.427 4.806a4.105 4.105 0 1 1 5.805 5.805 4.105 4.105 0 0 1-5.805-5.805m1.882 5.371a2.668 2.668 0 1 0 2.042-4.93 2.668 2.668 0 0 0-2.042 4.93m5.922-5.942a.958.958 0 1 1-1.355-1.355.958.958 0 0 1 1.355 1.355"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="list-social__link"
                href="http://www.youtube.com/@Do2Nite"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 20 20">
                  <path d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.13 2.13 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.13 2.13 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.17 2.17 0 0 1 1.53-1.53C4.679 4 10 4 10 4s5.321 0 6.63.34a2.17 2.17 0 0 1 1.53 1.53M8.3 12.5l4.42-2.55L8.3 7.4z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="list-social__link"
                href="https://www.tiktok.com/@do2nite"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 20 20">
                  <path d="M10.511 1.705h2.74s-.157 3.51 3.795 3.768v2.711s-2.114.129-3.796-1.158l.028 5.606A5.073 5.073 0 1 1 8.213 7.56h.708v2.785a2.298 2.298 0 1 0 1.618 2.205z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="list-social__link"
                href="https://x.com/do2nite"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.273 2.8 10.8 7.822 15.218 2.8h1.768l-5.4 6.139 5.799 8.254h-4.658l-3.73-5.31-4.671 5.31H2.558l5.654-6.427L2.615 2.8zm6.242 13.125L5.07 4.109h1.405l8.446 11.816z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <small>
              © 2026, <a href="/">Do2Nite</a>
            </small>
            <ul className="footer__policies">
              <li>
                <a href="#faq">Knowledge Base</a>
              </li>
              <li>
                <a href="#privacy">Privacy policy</a>
              </li>
              <li>
                <a href="#terms">Terms of service</a>
              </li>
              <li>
                <a href="#refund">Refund policy</a>
              </li>
              <li>
                <a href="#cancellation">Cancellation policy</a>
              </li>
              <li>
                <a href="#shipping">Shipping policy</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
