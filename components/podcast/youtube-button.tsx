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
    className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
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
