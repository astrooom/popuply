"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import type { Popup as PopupType, Site } from "@/db/schema"
import { GripVerticalIcon } from "lucide-react"
import { cn } from "@/utils/cn"
import { toast } from "sonner"
import { PopupForm } from "./PopupForm"

export function DragDropPopups({ siteId, popups: initialPopups }: { siteId: Site["id"]; popups: PopupType[] }) {
  useEffect(() => {
    setPopups(initialPopups)
  }, [initialPopups])

  const [popups, setPopups] = useState(initialPopups)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newPopups = Array.from(popups)
    const [reorderedItem] = newPopups.splice(source.index, 1)
    newPopups.splice(destination.index, 0, reorderedItem)

    // Update the order of all popups
    const updatedPopups = newPopups.map((popup, index) => ({
      ...popup,
      order: index,
    }))

    setPopups(updatedPopups)

    // Send re-order request with the id and the order of each popup
    const response = await fetch(`/api/sites/${siteId}/popups/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPopups.map((popup) => ({ id: popup.id, order: popup.order }))),
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
      setPopups(initialPopups)
    }

    // toast.success("Popups reordered!")
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="popups-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn("flex flex-col gap-y-2 mx-auto", popups.length > 0 && "lg:mr-8")}
          >
            {popups.length === 0 ? (
              <p className="ml-auto text-muted-foreground">No popups configured for this site yet.</p>
            ) : (
              popups.map((popup, index) => (
                <Draggable key={popup.id} draggableId={popup.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                      className={cn("flex rounded-xl items-center", snapshot.isDragging && "opacity-50 bg-muted-foreground/10")}
                    >
                      <div {...provided.dragHandleProps} className="p-2 cursor-move mb-10">
                        <GripVerticalIcon size={20} />
                      </div>
                      <div>
                        <PopupForm popup={popup} />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
