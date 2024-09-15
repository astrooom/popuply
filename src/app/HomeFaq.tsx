import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion"
import { Smartphone, Settings, Zap, Globe } from "lucide-react"

export function HomeFaq() {
  const faqItems = [
    {
      icon: Globe,
      question: "Is it compatible with my platform?",
      answer: (
        <>
          Popuply works anywhere you can insert a code snippet! Here&apos;s a list of popular platforms where you can easily integrate Popuply:
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-3">
            {[
              "WordPress", "Shopify", "Wix", "Squarespace", "Webflow",
              "Ghost", "Bubble", "Framer", "Weebly", "BigCommerce",
              "Magento", "Drupal", "Joomla", "PrestaShop", "OpenCart",
              "Salesforce Commerce Cloud", "WHMCS", "WooCommerce", "Custom HTML/CSS/JS sites", "Any JS framework"
            ].map((platform, index) => (
              <div key={index} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                {platform}
              </div>
            ))}
          </div>
          <p className="mt-3">If you can add a script tag to your site, you&apos;re good to go with Popuply!</p>
        </>
      ),
    },
    {
      icon: Settings,
      question: "What can I customize?",
      answer: (
        <>
          Popuply offers a wide range of customization options:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Content of the popups (obviously!)</li>
            <li>Display duration and frequency</li>
            <li>Popup order (sequential or random)</li>
            <li>Light or Dark mode</li>
            <li>URL links and icons</li>
            <li>Page-specific display settings</li>
          </ul>
        </>
      ),
    },
    {
      icon: Zap,
      question: "Can I trigger popups based on events?",
      answer: (
        <>
          Absolutely! Our webhook feature allows you to easily trigger real-time popups based on various events. Some cool use-cases include:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>New orders or sign-ups</li>
            <li>Product updates (new items, stock changes)</li>
            <li>Fresh content (blog posts, reviews)</li>
          </ul>
          <p className="mt-2"><strong>How it works:</strong> We use websockets for instant, real-time popup delivery!</p>
        </>
      ),
    },
    {
      icon: Smartphone,
      question: "Does it work on mobile devices?",
      answer: "You bet! Popuply is fully responsive. On mobile, we show one popup at a time to ensure a great user experience without cluttering the screen.",
    },
  ]

  return (
    <Accordion className="flex w-full flex-col space-y-4">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="w-full p-4 text-left text-foreground text-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold flex items-center">
            <item.icon className="mr-3 h-6 w-6 text-purple-500" />
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-900">
            <p className="text-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}