"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Shuffle } from "lucide-react"
import type { PodcastEpisode } from "@/types/podcast"
import { ListenButton } from "@/components/podcast/listen-button"
import { ApplePodcastButton } from "@/components/podcast/apple-podcast-button"
import { YoutubeButton } from "@/components/podcast/youtube-button"

interface EpisodeCardProps {
  episode: PodcastEpisode
  onNewRandom: () => void
}

export default function EpisodeCard({ episode, onNewRandom }: EpisodeCardProps) {
  return (
    <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-black/80 backdrop-blur-sm border border-slate-800 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-light">{episode.title}</CardTitle>
            <CardDescription className="text-blue-400 text-xs">
              {episode.category.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-black text-blue-300 border-slate-800 text-xs">
            Episode
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-slate-900/50 rounded-md mb-4 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- external image from podcast RSS feed */}
          <img
            src={episode.imageUrl ?? "/placeholder.svg?height=300&width=300"}
            alt={episode.title}
            className="h-full w-full object-cover rounded-md"
          />
        </div>
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
            className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
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

