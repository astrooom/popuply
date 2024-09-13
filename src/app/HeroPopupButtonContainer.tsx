import { Button } from "@/components/ui/Button"
import { HeroPopupButton } from "./HeroPopupButton"
import { getTestSite } from "@/lib/api/sites"

export async function HeroPopupButtonContainer() {
  const { id } = await getTestSite()
  return <HeroPopupButton />
}

export function HeroPopupButtonSkeleton() {
  return (
    <Button className="w-full md:w-1/3" disabled>
      Pop-up! 🔔
    </Button>
  )
}
