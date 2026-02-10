import type { PodcastEpisode } from "@/types/podcast";

const MAX_HISTORY_ENTRIES = 100;
const HISTORY_ENTRY_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes
const SELECTION_HISTORY_STORAGE_KEY = "random-tad-selection-history";

interface SelectionHistoryEntry {
  episodeId: string;
  selectedAt: number;
}

function loadHistory(): SelectionHistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(SELECTION_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveHistory(history: SelectionHistoryEntry[]): void {
  sessionStorage.setItem(
    SELECTION_HISTORY_STORAGE_KEY,
    JSON.stringify(history)
  );
}

function pruneExpiredEntries(): void {
  const history = loadHistory();
  const now = Date.now();
  const pruned = history.filter(
    (entry) => now - entry.selectedAt < HISTORY_ENTRY_MAX_AGE_MS
  );
  saveHistory(pruned);
}

function recordSelection(episodeId: string): void {
  const history = loadHistory();
  history.push({ episodeId, selectedAt: Date.now() });
  // Trim to max size, keeping the most recent entries
  const trimmed =
    history.length > MAX_HISTORY_ENTRIES
      ? history.slice(history.length - MAX_HISTORY_ENTRIES)
      : history;
  saveHistory(trimmed);
}

function clearHistory(): void {
  sessionStorage.removeItem(SELECTION_HISTORY_STORAGE_KEY);
}

function pickOneAtRandom(episodes: PodcastEpisode[]): PodcastEpisode {
  const randomIndex = Math.floor(Math.random() * episodes.length);
  return episodes[randomIndex];
}

export function selectRandomEpisode(
  episodes: PodcastEpisode[]
): PodcastEpisode | null {
  if (episodes.length === 0) return null;

  pruneExpiredEntries();
  const history = loadHistory();

  const freshEpisodes = episodes.filter(
    (episode) => !history.some((entry) => entry.episodeId === episode.id)
  );

  // When every eligible episode has been selected recently,
  // clear the history and start fresh.
  if (freshEpisodes.length === 0) {
    clearHistory();
    const selected = pickOneAtRandom(episodes);
    recordSelection(selected.id);
    return selected;
  }

  const selected = pickOneAtRandom(freshEpisodes);
  recordSelection(selected.id);
  return selected;
}
