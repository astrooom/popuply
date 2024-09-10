import type { Site } from "@/db/schema";
import { getPopups } from "@/lib/api/popups";

import { DragDropPopups } from "./DragDropPopups";
import { AddPopupButton } from "./AddPopupButton";


export async function DragDropPopupsContainer({ siteId }: { siteId: Site["id"] }) {

  const popups = await getPopups({ siteId })

  return (
    <div className="h-full p-3 mb-4 border rounded-lg border-4 border-dashed lg:w-[480px] flex flex-col gap-y-4">
      <AddPopupButton siteId={siteId} className="mr-auto font-bold" variant="ghost" />
      <DragDropPopups siteId={siteId} popups={popups} />
    </div>
  )
}