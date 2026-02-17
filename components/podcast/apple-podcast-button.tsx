import { PodcastEpisode } from "@/types/podcast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Custom Apple icon component
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  )
}

interface ItunesResult {
  trackName: string;
  trackViewUrl: string;
}

async function searchItunes(searchTerm: string, limit: number): Promise<ItunesResult[]> {
  try {
    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&limit=${limit}&media=podcast&entity=podcastEpisode`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`iTunes API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error("Error fetching iTunes data:", error);
    return [];
  }
}

function findMatchingEpisode(results: ItunesResult[], episodeTitle: string): string | null {
  const normalizedTitle = episodeTitle.toLowerCase();
  const match = results.find(
    (result) => result.trackName?.toLowerCase() === normalizedTitle
  );
  return match?.trackViewUrl ?? null;
}

async function getApplePodcastsLink(episodeTitle: string): Promise<string | null> {
  const searchTerm = `trek am dienstag ${episodeTitle}`;

  // Quick search with limit=1
  const quickResults = await searchItunes(searchTerm, 1);
  const quickMatch = findMatchingEpisode(quickResults, episodeTitle);
  if (quickMatch) return quickMatch;

  // Expanded search with limit=10
  const expandedResults = await searchItunes(searchTerm, 10);
  const expandedMatch = findMatchingEpisode(expandedResults, episodeTitle);
  if (expandedMatch) return expandedMatch;

  return null;
}

type ButtonState = "idle" | "loading" | "not_found";

interface ApplePodcastButtonProps {
  episode: PodcastEpisode
};

export function ApplePodcastButton({ episode }: ApplePodcastButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");

  const handleClick = async () => {
    if (state !== "idle") return;

    setState("loading");

    try {
      const episodeTitle = episode.itunesTitle || episode.title;
      const url = await getApplePodcastsLink(episodeTitle);

      if (url) {
        // Push the current page onto the history stack so the user can navigate back
        // after being sent to Apple Podcasts. On iOS, Universal Links intercept the
        // navigation and open the Podcasts app without actually leaving the page.
        // On desktop, the browser navigates to the Apple Podcasts website and the
        // user can hit back to return to random-tad.
        history.pushState(null, "", window.location.href);
        window.location.href = url;
        setState("idle");
      } else {
        setState("not_found");
      }
    } catch (error) {
      console.error("Error getting Apple Podcasts link:", error);
      setState("not_found");
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-1 border-blue-500/20 text-slate-300 bg-blue-950/30 hover:bg-blue-900/40 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      size="sm"
      disabled={state !== "idle"}
      onClick={handleClick}
    >
      {state === "loading" ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <AppleIcon className="h-3 w-3" />
      )}
      <span>Apple Podcasts</span>
    </Button>
  );
}
