import { PodcastEpisode } from "@/types/podcast";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ListenButtonProps {
  episode: PodcastEpisode
};

export function ListenButton({ episode }: ListenButtonProps) {
  return <Button
    className="flex-1 bg-blue-900/50 hover:bg-blue-800/50 text-white border border-blue-800/50"
    size="sm"
    disabled={!episode.linkUrl}
    asChild
  >
    <a href={episode.linkUrl} title={episode.title}>
      <Play className="w-3 h-3 mr-1" />
      Listen
    </a>
  </Button>
}
