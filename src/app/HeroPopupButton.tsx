"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/cn"
import { toast } from "sonner"

export function HeroPopupButton() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    // Initial check
    checkDarkMode()

    // Set up an observer to watch for changes to the class attribute
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Clean up the observer when the component unmounts
    return () => observer.disconnect()
  }, [])

  const testPopups = [
    {
      title: "Sold Green T-shirt",
      content: "Forest Flair",
      timestamp: "5 minutes ago",
      icon_url: "https://popuply.b-cdn.net/showcase/green-tshirt.png",
    },
    {
      title: "Sold Blue Jeans",
      content: "Ocean Atmosphere",
      icon_url: "https://popuply.b-cdn.net/showcase/blue-jeans.png",
      timestamp: "10 minutes ago",
    },
    {
      title: "Sold Winter Beanie",
      content: "Wintery Warmth",
      icon_url: "https://popuply.b-cdn.net/showcase/winter-beanie.png",
      timestamp: "1 minute ago",
    },
    {
      title: "Sold Yellow Socks",
      content: "Keep yourself grounded",
      icon_url: "https://popuply.b-cdn.net/showcase/yellow-socks.png",
      timestamp: "3 minutes ago",
    },
    {
      title: "Sold Red Hoodie",
      content: "Cozy Crimson",
      icon_url: "https://popuply.b-cdn.net/showcase/red-hoodie.png",
      timestamp: "2 minutes ago",
    },
    {
      title: "Sold White Sneakers",
      content: "Urban Stride",
      icon_url: "https://popuply.b-cdn.net/showcase/white-sneakers.png",
      timestamp: "7 minutes ago",
    },
    {
      title: "Sold Black Leather Jacket",
      content: "Timeless Edge",
      icon_url: "https://popuply.b-cdn.net/showcase/black-leather-jacket.png",
      timestamp: "12 minutes ago",
    },
    {
      title: "Sold Floral Sundress",
      content: "Blossom Breeze",
      icon_url: "https://popuply.b-cdn.net/showcase/floral-sundress.png",
      timestamp: "15 minutes ago",
    },
    {
      title: "Sold Denim Jacket",
      content: "Casual Classic",
      icon_url: "https://popuply.b-cdn.net/showcase/denim-jacket.png",
      timestamp: "20 minutes ago",
    },
    {
      title: "Sold Yellow Scarf",
      content: "Regal Wrap",
      icon_url: "https://popuply.b-cdn.net/showcase/yellow-scarf.png",
      timestamp: "25 minutes ago",
    },
    {
      title: "New Video Published!",
      content: "Check it out!",
      icon_url: "https://popuply.b-cdn.net/showcase/youtube-logo.png",
      timestamp: "Now",
    },
  ]

  async function testPopup() {
    const randomPopup = testPopups[Math.floor(Math.random() * testPopups.length)]
    const popupData = {
      ...randomPopup,
      theme: isDarkMode ? "dark" : "light",
    }

    const response = await fetch(`/api/external/webhook/showcase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(popupData),
    })

    const { error } = await response.json()
    if (error) {
      toast.error(error)
    }
  }

  return (
    <Button
      onClick={testPopup}
      className={cn(
        "w-full md:w-1/3",
        isDarkMode ? "bg-fuchsia-900 hover:bg-fuchsia-800 text-white" : "bg-fuchsia-700 hover:bg-fuchsia-800",
      )}
    >
      Pop-up! 🔔
    </Button>
  )
}
