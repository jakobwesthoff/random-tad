"use client"

import type { Locale } from "@/lib/welcome"
import { Button } from "@/components/ui/button"

interface LocalizedWelcomeContentProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  onDismiss: () => void
}

function renderGerman(onDismiss: () => void) {
  return (
    <>
      <h2
        id="welcome-title"
        className="text-3xl sm:text-4xl font-bold tracking-wide text-white animate-[fadeInUp_0.6s_ease-out_both]"
      >
        Was ist Random TAD?
      </h2>
      <div
        id="welcome-description"
        className="max-w-lg text-sm sm:text-base leading-relaxed text-slate-300 animate-[fadeInUp_0.6s_ease-out_0.15s_both]"
      >
        <p>
          &bdquo;<a
            href="https://trekamdienstag.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >Trek am Dienstag</a>&ldquo; ist ein deutscher Star-Trek-Podcast von
          Sebastian und Simon. Seit 2017 besprechen sie alle
          Star-Trek-Serien in US-Erstausstrahlungsreihenfolge noch einmal
          — angefangen bei &bdquo;The Man Trap&ldquo; von 1966, dazu
          Specials, Streams und mehr.
        </p>
        <p className="mt-3">
          Bei hunderten Folgen im Archiv kann die Auswahl zur
          Herausforderung werden. Random TAD schafft Abhilfe — drück den
          Button, bekomm eine zufällige Folge vorgeschlagen und hör direkt
          rein. Mit dem Serienfilter findest du gezielt Folgen zu deiner
          Lieblingsserie.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Random TAD ist ein unabhängiges Fan-Projekt und steht in keiner
          Verbindung zum Podcast.
        </p>
      </div>
      <Button
        onClick={onDismiss}
        className="mt-2 px-10 py-5 text-base rounded-full border border-blue-500/50 bg-blue-950/40 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:border-blue-400/70 hover:bg-blue-900/40 transition-all duration-300 animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
      >
        Los geht&apos;s
      </Button>
    </>
  )
}

function renderEnglish(onDismiss: () => void) {
  return (
    <>
      <h2
        id="welcome-title"
        className="text-3xl sm:text-4xl font-bold tracking-wide text-white animate-[fadeInUp_0.6s_ease-out_both]"
      >
        What is Random TAD?
      </h2>
      <div
        id="welcome-description"
        className="max-w-lg text-sm sm:text-base leading-relaxed text-slate-300 animate-[fadeInUp_0.6s_ease-out_0.15s_both]"
      >
        <p>
          &ldquo;<a
            href="https://trekamdienstag.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >Trek am Dienstag</a>&rdquo; is a German Star Trek podcast by
          Sebastian and Simon. Since 2017, they&apos;ve been discussing all
          of Star Trek in original US broadcast order — starting with
          &ldquo;The Man Trap&rdquo; from 1966, plus specials, streams, and
          more.
        </p>
        <p className="mt-3">
          With hundreds of episodes in the archive, choosing one can be
          overwhelming. Random TAD helps — press the button, get a random
          episode, and start listening. Use the series filter to narrow it
          down to your favorite Star Trek show.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Random TAD is an independent fan project and is not affiliated with
          the podcast.
        </p>
      </div>
      <Button
        onClick={onDismiss}
        className="mt-2 px-10 py-5 text-base rounded-full border border-blue-500/50 bg-blue-950/40 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:border-blue-400/70 hover:bg-blue-900/40 transition-all duration-300 animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
      >
        Start Exploring
      </Button>
    </>
  )
}

export default function LocalizedWelcomeContent({
  locale,
  onLocaleChange,
  onDismiss,
}: LocalizedWelcomeContentProps) {
  return (
    <div className="flex flex-col items-center h-full px-6 py-8 text-center gap-5 overflow-y-auto overscroll-y-none my-auto">
      {/* Language toggle */}
      <div className="flex gap-2 animate-[fadeInUp_0.6s_ease-out_both]">
        <button
          onClick={() => onLocaleChange("de")}
          aria-label="Deutsch"
          className={`text-2xl transition-opacity ${locale === "de" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
        >
          🇩🇪
        </button>
        <button
          onClick={() => onLocaleChange("en")}
          aria-label="English"
          className={`text-2xl transition-opacity ${locale === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
        >
          🇬🇧
        </button>
      </div>

      {locale === "de" ? renderGerman(onDismiss) : renderEnglish(onDismiss)}
    </div>
  )
}
