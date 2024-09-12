"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form"

import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation"
import type { Popup as PopupType } from "@/db/schema"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { BUNNYCDN_PULLZONE_URL } from "@/lib/constants/bunnycdn"
import { Link2OffIcon, LinkIcon, MoonIcon, SaveIcon, SunMoonIcon, UploadIcon, XIcon } from "lucide-react"
import { cn } from "@/utils/cn"
import { Card } from "@/components/ui/Card"
import { DeletePopupButton } from "./DeletePopupButton"

const MAX_IMAGE_SIZE = 5000000
const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "gif"]
const ACCEPTED_IMAGE_TYPES = [...ACCEPTED_IMAGE_EXTENSIONS.map((extension) => `image/${extension}`), "image/svg+xml"]

const FormSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }).max(2048, { message: "Max 2048 characters" }),
  content: z.string().min(1, { message: "Please enter content" }).max(2048, { message: "Max 2048 characters" }),
  timestamp: z.string().max(255, { message: "Max 255 characters" }),
  theme: z.enum(["light", "dark"]),
  link_url: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only ${ACCEPTED_IMAGE_EXTENSIONS.join(", ")} formats are supported.`,
    )
    .optional(),
})

export function PopupForm({ popup: initialPopup, className }: { popup: PopupType; className?: string }) {
  const [popup, setPopup] = useState<PopupType>(initialPopup)

  useEffect(() => {
    setPopup(initialPopup)
  }, [initialPopup])

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { refresh } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: popup?.title ?? "",
      content: popup?.content ?? "",
      timestamp: popup?.timestamp ?? "",
      link_url: popup?.link_url ?? "",
      theme: popup?.theme ?? "light",
      image: undefined,
    },
  })

  const { clearErrors } = form

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Convert File to data URL before submission
    let dataToSubmit = { ...data }
    if (data.image instanceof File) {
      const dataUrl = await fileToDataUrl(data.image)
      dataToSubmit.image = dataUrl
    }

    const response = await fetch(`/api/sites/${popup?.siteId}/popups/${popup?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Popup edited!")
      refresh()
    }
  }

  const handleFormBlur = (e: React.FocusEvent) => {
    const currentTarget = e.currentTarget
    // Use setTimeout to check if the focus is outside the form after the current event loop
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        clearErrors()
      }
    }, 0)
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        form.setValue("image", file)
        setPreviewImage(URL.createObjectURL(file))
      }
    },
    [form],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: MAX_IMAGE_SIZE,
    accept: {
      "image/*": ACCEPTED_IMAGE_EXTENSIONS,
    },
  })

  const imageUrl = popup?.icon_url ? `${BUNNYCDN_PULLZONE_URL}/${popup?.icon_url}?t=${new Date().getTime()}` : null

  const handleAddLink = () => {
    const url = prompt("Enter the link URL:")
    if (url) {
      form.setValue("link_url", url)
    }
  }

  const handleClearLink = () => {
    form.setValue("link_url", "", { shouldValidate: true })
  }

  const handleSetTheme = (theme: "light" | "dark") => {
    if (popup) {
      form.setValue("theme", theme)
      setPopup({ ...popup, theme })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} onBlur={handleFormBlur}>
        <Card
          className={cn("p-2 h-full rounded-xl relative shadow-md lg:w-[370px]", popup?.theme === "dark" ? "bg-[#333333]" : "bg-white")}
        >
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={cn(
                        "relative border-dashed rounded-lg cursor-pointer border-[1.5px] p-1 hover:bg-muted-foreground/10 w-[54px] h-[54px] flex items-center justify-center overflow-hidden",
                        popup?.theme === "dark" ? "bg-[#333333] border-neutral-400/50" : "bg-white border-neutral-700/50",
                      )}
                    >
                      {previewImage ? (
                        <Image src={previewImage} objectFit="contain" fill={true} alt={`${popup?.id}`} priority={false} />
                      ) : imageUrl ? (
                        <Image
                          src={imageUrl}
                          overrideSrc={imageUrl}
                          objectFit="contain"
                          fill={true}
                          alt="Popup default image"
                          priority={false}
                        />
                      ) : (
                        <UploadIcon className="w-[15px] h-[15px]" />
                      )}
                      <input
                        {...getInputProps()}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            field.onChange(file)
                            setPreviewImage(URL.createObjectURL(file))
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-xs">Title</FormLabel> */}
                    <FormControl>
                      <Input
                        variant="ghost"
                        className={cn(
                          "border-0 h-6 text-[14px] font-semibold",
                          popup?.theme === "dark" ? "bg-[#333333] text-white placeholder:text-white/70" : "bg-white text-black",
                        )}
                        placeholder="Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-xs">Content</FormLabel> */}
                    <FormControl>
                      <Input
                        variant="ghost"
                        className={cn(
                          "border-0 h-6 text-[13px]",
                          popup?.theme === "dark" ? "bg-[#333333] text-white placeholder:text-white/70" : "bg-white text-black",
                        )}
                        placeholder="Content"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="timestamp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={cn(
                      "absolute top-[8px] right-0 h-6 text-[13px] w-24",
                      popup?.theme === "dark"
                        ? "bg-transparent text-white/70 placeholder:text-white/50"
                        : "bg-white text-black/70 placeholder:text-black/50",
                    )}
                    variant="ghost"
                    placeholder="Timestamp"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <div className="flex gap-x-1 pt-1">
          <Button variant="ghost" size="sm" type="submit" className="hover:bg-muted-foreground/20">
            <SaveIcon className="w-[15px] h-[15px] text-green-700" />
          </Button>

          <FormField
            control={form.control}
            name="link_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Input className="hidden" {...field} />

                    {field.value ? (
                      <Button type="button" variant="ghost" className="hover:bg-muted-foreground/20" size="sm" onClick={handleClearLink}>
                        <Link2OffIcon className="w-[15px] h-[15px] text-blue-500" />
                      </Button>
                    ) : (
                      <Button type="button" variant="ghost" className="hover:bg-muted-foreground/20" size="sm" onClick={handleAddLink}>
                        <LinkIcon className="w-[15px] h-[15px] text-blue-500" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="hover:bg-muted-foreground/20"
                      size="sm"
                      onClick={() => {
                        handleSetTheme(field.value === "light" ? "dark" : "light")
                      }}
                    >
                      {field.value === "light" ? (
                        <SunMoonIcon className="w-[15px] h-[15px]" />
                      ) : (
                        <MoonIcon className="w-[15px] h-[15px] " />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DeletePopupButton siteId={popup.siteId} popup={popup} />
        </div>
      </form>
    </Form>
  )
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
