import { PodcastEpisode } from "@/types/podcast";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";

interface YoutubeButtonProps {
  episode: PodcastEpisode
};

export function YoutubeButton({ episode }: YoutubeButtonProps) {
  // YouTube search term
  const youtubeSearchTerm = encodeURIComponent(`Trek am Dienstag – Der Star-Trek-Podcast ${episode.title}`)
  const youtubeUrl = `https://www.youtube.com/results?search_query=${youtubeSearchTerm}`

  return <Button
    variant="outline"
    className="flex-1 border-blue-500/20 text-slate-300 bg-blue-950/30 hover:bg-blue-900/40 hover:text-white"
    size="sm"
    asChild
  >
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Youtube className="h-3 w-3" />
      <span>YouTube</span>
    </a>
  </Button>
}
