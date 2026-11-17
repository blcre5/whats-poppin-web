import { CATEGORIES, EventItem, SAMPLE_EVENTS } from "./data";

const DEFAULT_SHEET_ID = "1dvaWWZxRX2FuL88SnT49UN5nXoZeiI6yvYarZJbomAM";
const DEFAULT_SHEET_GID = "143547057";
const DEFAULT_SHEET_RANGE = "'NOVEMBER '!A:H";
const DEFAULT_TIMEZONE = "America/Los_Angeles";

const CATEGORY_MAP: Record<string, string> = {
  "food / drink specials": "Food & Drinks",
  "live music / art": "Music",
  "karaoke / open mic": "Music",
  "games / competitions": "Games",
  "comedy": "Arts",
  "film / theater": "Arts",
  "film / theatre": "Arts",
  "movement / mindfulness": "Sports",
  "market / vendors": "Shopping",
  "specials / sales": "Shopping",
  "community / exchange": "Community",
  "meet ups / discussions": "Community",
  "meetups / discussions": "Community",
};

function getCategoryColor(categoryName: string): string {
  const match = CATEGORIES.find((c) => c.name === categoryName);
  return match ? match.color : "#8A97D6";
}

function mapCategory(rawCategory: string): string {
  const normalized = rawCategory.trim().toLowerCase();
  if (CATEGORY_MAP[normalized]) {
    return CATEGORY_MAP[normalized];
  }
  const direct = CATEGORIES.find((c) => c.name.toLowerCase() === normalized);
  return direct ? direct.name : "Community";
}

/**
 * Parse RFC-4180 CSV text into a 2D array of cell strings.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      currentRow.push(currentCell);
      currentCell = "";
    } else if (ch === "\r" && next === "\n") {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      i++;
    } else if (ch === "\n" || ch === "\r") {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += ch;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function getTodayPartsInZone(timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value ?? new Date().getFullYear());
  const month = Number(parts.find((p) => p.type === "month")?.value ?? new Date().getMonth() + 1);
  const day = Number(parts.find((p) => p.type === "day")?.value ?? new Date().getDate());
  return { year, month, day };
}

function computeDayOffset(dateStr: string): number | null {
  const match = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);

  const today = getTodayPartsInZone(process.env.EVENTS_TIMEZONE || DEFAULT_TIMEZONE);
  const eventUtc = Date.UTC(year, month - 1, day);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  return Math.round((eventUtc - todayUtc) / 86_400_000);
}

function formatCompactTime(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
  if (!match) return trimmed;
  return `${match[1]}${match[2].toLowerCase().startsWith("a") ? "a" : "p"}`;
}

function parseTimeRange(rawTime: string): { startTime: string; endTime: string; timeNote?: string } {
  const trimmed = rawTime.trim();
  if (!trimmed) {
    return { startTime: "TBD", endTime: "" };
  }

  // Split on hyphen or en-dash with optional surrounding spaces
  const parts = trimmed.split(/\s*[-–]\s*/);
  if (parts.length >= 2 && /\d/.test(parts[0])) {
    return {
      startTime: formatCompactTime(parts[0]),
      endTime: formatCompactTime(parts[1]),
    };
  }

  // Single time like "6:30 PM" or "11:11 AM"
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(trimmed)) {
    return {
      startTime: formatCompactTime(trimmed),
      endTime: "",
    };
  }

  // Descriptive time string (e.g. "Check @... Story for Clues!")
  return {
    startTime: "All Day",
    endTime: "",
    timeNote: trimmed,
  };
}

function buildTags(cost: string, rawCategory: string): string[] {
  const tags: string[] = [];
  const trimmedCost = cost.trim();
  const trimmedCat = rawCategory.trim();

  if (/^free\b/i.test(trimmedCost)) {
    tags.push("Free");
  } else if (trimmedCost && !/^visit for/i.test(trimmedCost)) {
    tags.push(trimmedCost);
  }

  if (trimmedCat) {
    tags.push(trimmedCat);
  }

  return Array.from(new Set(tags));
}

export function mapSheetRowsToEvents(rows: string[][]): EventItem[] {
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string, fallback: number) => {
    const idx = header.indexOf(name);
    return idx >= 0 ? idx : fallback;
  };

  const dateIdx = col("date", 0);
  const titleIdx = col("event name", 2);
  const locationIdx = col("location", 3);
  const timeIdx = col("time", 4);
  const costIdx = col("cost", 5);
  const categoryIdx = col("category", 7);

  const city = process.env.DEFAULT_CITY || "Ashland";
  const state = process.env.DEFAULT_STATE || "OR";
  const zip = process.env.DEFAULT_ZIP || "97520";

  const events: EventItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const dateStr = (row[dateIdx] ?? "").trim();
    const title = (row[titleIdx] ?? "").trim();
    if (!dateStr || !title) continue;

    const dayOffset = computeDayOffset(dateStr);
    if (dayOffset === null) continue;

    const venue = (row[locationIdx] ?? "").trim() || "Local Venue";
    const rawTime = (row[timeIdx] ?? "").trim();
    const cost = (row[costIdx] ?? "").trim();
    const rawCategory = (row[categoryIdx] ?? "").trim();

    const category = mapCategory(rawCategory);
    const categoryColor = getCategoryColor(category);
    const { startTime, endTime, timeNote } = parseTimeRange(rawTime);

    const descParts = [
      rawCategory || null,
      cost ? `Cost: ${cost}` : null,
      timeNote ? `Time: ${timeNote}` : null,
    ].filter(Boolean);

    events.push({
      id: `sheet-${i}`,
      title,
      venue,
      venueTypeColor: categoryColor,
      city,
      state,
      zip,
      address: venue,
      distance: "",
      category,
      categoryColor,
      startTime,
      endTime,
      description: descParts.join(" · ") || "Local event",
      tags: buildTags(cost, rawCategory),
      dayOffset,
    });
  }

  return events;
}

export interface SheetFetchResult {
  events: EventItem[];
  source: "google-sheets" | "fallback";
  error?: string;
}

export async function getSheetEvents(): Promise<SheetFetchResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const gid = process.env.GOOGLE_SHEET_GID || DEFAULT_SHEET_GID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const range = process.env.GOOGLE_SHEET_RANGE || DEFAULT_SHEET_RANGE;

  try {
    let rows: string[][] = [];

    if (apiKey) {
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
        range
      )}?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(apiUrl, { next: { revalidate: 60 } });
      if (!res.ok) {
        throw new Error(`Google Sheets API returned ${res.status}`);
      }
      const data = (await res.json()) as { values?: string[][] };
      rows = data.values ?? [];
    } else {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      const res = await fetch(csvUrl, {
        next: { revalidate: 60 },
        redirect: "follow",
      });
      if (!res.ok) {
        throw new Error(`Google Sheets CSV export returned ${res.status}`);
      }
      const text = await res.text();
      if (text.trimStart().startsWith("<!DOCTYPE html") || text.trimStart().startsWith("<html")) {
        throw new Error(
          "Google Sheet is not publicly readable (returned HTML login page). Set sharing to 'Anyone with the link can view' or set GOOGLE_SHEETS_API_KEY."
        );
      }
      rows = parseCsv(text);
    }

    const events = mapSheetRowsToEvents(rows);
    if (events.length === 0) {
      throw new Error("No valid event rows found in Google Sheet.");
    }

    return { events, source: "google-sheets" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error fetching Google Sheet";
    console.warn(`[Do2Nite] Falling back to sample events: ${message}`);
    return {
      events: SAMPLE_EVENTS,
      source: "fallback",
      error: message,
    };
  }
}
