import React from "react"
import { Bell, Zap, BarChart, Paintbrush, Lock, Layout, Webhook, Shuffle } from "lucide-react"

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <Icon className="w-12 h-12 text-purple-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
)

export const LearnMore = () => {
  const features = [
    {
      icon: Bell,
      title: "Instant Engagement",
      description: "Captivate visitors from the moment they land with pre-configured popups that appear instantly.",
    },
    {
      icon: Shuffle,
      title: "Flexible Ordering",
      description: "Display popups in randomized or selective order for predictable or unpredictable experiences.",
    },
    {
      icon: Webhook,
      title: "Webhook Triggers",
      description: "Trigger customized popups based on webhook events for dynamic, real-time user engagement.",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our super simple Popup builder. No coding skills required.",
    },
    {
      icon: BarChart,
      title: "Basic Analytics",
      description: "Track how many visitors see and interact with your popups using our simple analytics.",
    },
    {
      icon: Paintbrush,
      title: "Easy Customization",
      description: "Adjust colors, text, and basic layout to match your website's look and feel.",
    },
  ]

  return (
    <section className="py-16" id="learnMore">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-foreground text-center mb-4">Why Choose Our Simple Popup Solution?</h2>
        <p className="text-xl text-center text-muted-foreground  mb-12 max-w-3xl mx-auto">
          Discover how our easy-to-use features can help you engage your audience without any hassle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
