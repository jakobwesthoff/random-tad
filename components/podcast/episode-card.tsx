"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Shuffle } from "lucide-react"
import type { PodcastEpisode } from "@/types/podcast"
import { ListenButton } from "@/components/podcast/listen-button"
import { ApplePodcastButton } from "@/components/podcast/apple-podcast-button"
import { YoutubeButton } from "@/components/podcast/youtube-button"
import { EpisodeImage } from "@/components/podcast/episode-image"

interface EpisodeCardProps {
  episode: PodcastEpisode
  onNewRandom: () => void
}

export default function EpisodeCard({ episode, onNewRandom }: EpisodeCardProps) {
  return (
    <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-[#0a0f1a] border border-blue-500/20 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-light">{episode.title}</CardTitle>
            <CardDescription className="text-blue-400 text-xs">
              {episode.category.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-950/60 text-blue-300 border-blue-500/20 text-xs">
            Episode
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <EpisodeImage key={episode.id} imageUrl={episode.imageUrl} title={episode.title} />
        <div className="text-sm text-slate-400 mb-4">{episode.description}</div>
        <div className="flex justify-between text-xs text-slate-500 mt-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{episode.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{episode.duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-2 w-full">
          <ListenButton episode={episode} />
          <Button
            variant="outline"
            className="flex-1 border-blue-500/20 text-slate-300 bg-blue-950/30 hover:bg-blue-900/40 hover:text-white"
            size="sm"
            onClick={onNewRandom}
          >
            <Shuffle className="w-3 h-3 mr-1" />
            New Random
          </Button>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-slate-500">Find this episode on:</p>
          <div className="grid grid-cols-2 gap-2">
            <ApplePodcastButton episode={episode} />
            <YoutubeButton episode={episode} />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
