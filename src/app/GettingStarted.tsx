"use client"

import { useRef, useState, useEffect } from "react"
import { Maximize, Minimize } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { cn } from "@/utils/cn"

type Step = {
  title: string
  description: string
  videoSrc: string
  className?: string
}

const steps: Step[] = [
  {
    title: "Configure your popups",
    description: "Easily set up and customize your popup toasts to match your brand and message.",
    videoSrc: "/videos/getting-started/configure_site.mp4",
    className: "scale-[1.20]",
  },
  {
    title: "Add script to your website",
    description: "Simply insert our lightweight script into your website's HTML.",
    videoSrc: "/videos/getting-started/enter_script_tag.mp4",
    className: "scale-[1.10]",
  },
  {
    title: "Watch popups appear",
    description: "See your engaging popup toasts in action, driving customer interaction.",
    videoSrc: "/videos/getting-started/popups_appear.mp4",
    className: "scale-[1.00]",
  },
]

const StepItem = ({ step, index }: { step: Step; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <AccordionItem value={`item-${index + 1}`} className="border-b border-gray-200 dark:border-gray-700">
      <AccordionTrigger className="py-4 transition-colors">
        <span className="flex items-center text-left">
          <span className="bg-gradient-to-r from-[#D247BF] to-fuchsia-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
            {index + 1}
          </span>
          <span className="font-semibold">{step.title}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="py-4">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
          <div className="rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-500 border-2">
            <div className="relative w-full pt-[56.25%]">
              <video
                ref={videoRef}
                src={step.videoSrc}
                preload="none"
                autoPlay
                loop
                muted
                playsInline
                className={cn("absolute top-0 left-0 w-full h-full object-cover", step.className)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export const GettingStarted = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Three Simple Steps</h2>
      <Accordion className="w-full">
        {steps.map((step, index) => (
          <StepItem key={index} step={step} index={index} />
        ))}
      </Accordion>
    </div>
  )
}
