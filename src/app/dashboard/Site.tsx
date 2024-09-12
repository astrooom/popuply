"use client"

import React from "react"
import { Site as SiteType } from "@/db/schema"
import { TableCell, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Image from "next/image"
import { CogIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

// Site component
export function Site({ site }: { site: SiteType }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          {site.faviconUrl && (
            <Image src={site.faviconUrl} alt={`${site.domain} favicon`} width={32} height={32} className="rounded-full" />
          )}
          <span className="font-semibold">{site.domain}</span>
        </div>
      </TableCell>
      <TableCell>{new Date(site.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {site?.visitors == null
          ? "Unknown"
          : site.visitors < 1000
            ? site.visitors
            : new Intl.NumberFormat("en", { notation: "compact" }).format(site.visitors)}
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/${site.id}`} passHref>
          <Button size="sm" variant="outline">
            <CogIcon className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}

export function MobileSite({ site }: { site: SiteType }) {
  return (
    <Card className="mb-4 w-full">
      <CardHeader className="flex flex-row items-center pb-2">
        {site.faviconUrl && (
          <Image src={site.faviconUrl} alt={`${site.domain} favicon`} width={32} height={32} className="rounded-full lg:inline hidden" />
        )}
        <CardTitle className="overflow-hidden truncate ">{site.domain}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Created on {new Date(site.createdAt).toLocaleDateString()}</p>
        <Link href={`/dashboard/${site.id}`} passHref>
          <Button size="sm" className="w-full">
            <CogIcon className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
