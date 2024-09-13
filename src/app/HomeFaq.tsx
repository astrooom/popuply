import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion"
import { ChevronRight } from "lucide-react"

export function HomeFaq() {
  return (
    <Accordion className="flex w-full flex-col">
      <AccordionItem value="getting-started">
        <AccordionTrigger className="w-full py-4 text-left text-foreground text-lg hover:text-zinc-500">
          Is it compatible with?...{" "}
          <ChevronRight className="ml-auto inline h-4 w-4 text-foreground transition-transform duration-200 group-data-[expanded]:rotate-90" />
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-foreground">
            Popuply is compatible anywhere you can insert a code snippet (script tag). This includes Wordpress, Shopify, Wix, Bubble,
            Squarespace, Wagtail and more.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="animation-properties">
        <AccordionTrigger className="w-full py-4 text-left text-foreground text-lg hover:text-zinc-500">
          What can I customize?{" "}
          <ChevronRight className="ml-auto inline h-4 w-4 text-foreground transition-transform duration-200 group-data-[expanded]:rotate-90" />
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-foreground">
            You can customize the following:
            <ul>
              <li>• The contents of the popups (duh)</li>
              <li>• How long popups should stay on the screen</li>
              <li>• Frequency between popups</li>
              <li>• Order of popups (or randomized)</li>
              <li>• Lightmode or Darkmode</li>
              <li>• Add URL links and icons</li>
              <li>• Which pages should be excluded or included from showing popups</li>
              {/* <li>• Popups triggered through a webhook</li> */}
            </ul>
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="webhook">
        <AccordionTrigger className="w-full py-4 text-left text-foreground text-lg hover:text-zinc-500">
          Can I make popups trigger on events{" "}
          <ChevronRight className="ml-auto inline h-4 w-4 text-foreground transition-transform duration-200 group-data-[expanded]:rotate-90" />
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-foreground">
            Yes, you can. We provide you with a webhook to trigger popups with the contents of your choice. This works through sending a
            JSON payload to our API. The popup will then appear on your website for all current visitors in realtime.<br></br>
            <br></br>
            <strong>Some example use-cases could be:</strong>
            <ul>
              <li>• New orders </li>
              <li>• New sign-ups to a newsletter </li>
              <li>• New products being added </li>
              <li>• Products going in and out of stock </li>
              <li>• New blog posts </li>
              <li>• New product reviews </li>
            </ul>
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="mobile">
        <AccordionTrigger className="w-full py-4 text-left text-foreground text-lg hover:text-zinc-500">
          Does it work on mobile?{" "}
          <ChevronRight className="ml-auto inline h-4 w-4 text-foreground transition-transform duration-200 group-data-[expanded]:rotate-90" />
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-foreground">Yes it does! On mobile, only one popup will appear at a time to save screen space.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
