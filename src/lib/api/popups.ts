import "server-only";

import { Popup, popups, PopupsReorder, PopupUpdate, Site, sites } from "@/db/schema";
import { assertAuthenticated } from "../auth/session";
import { and, asc, db, eq, sql } from "@/db";
import { serverLogger } from "../utils/server/logging";

export const getPopups = async ({ siteId }: { siteId: Site["id"] }): Promise<Popup[]> => {
  const user = await assertAuthenticated();
  if (!user) {
    throw new Error("User not found");
  }

  const siteWithPopups = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.userId, user.id)
    ),
    with: {
      popups: {
        orderBy: asc(popups.order),
      }
    }
  });

  if (!siteWithPopups) {
    throw new Error("Site not found or doesn't belong to the user");
  }

  return siteWithPopups.popups;
};

export const reorderPopups = async ({ siteId, reorderPopups: popupsToReorder }: { siteId: Site["id"], reorderPopups: PopupsReorder }) => {
  const user = await assertAuthenticated();
  if (!user) {
    throw new Error("User not found");
  }

  const site = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.userId, user.id)
    )
  });

  if (!site) {
    throw new Error("Site not found or doesn't belong to the user");
  }

  const updatedPopups = await db.transaction(async (tx) => {
    const values = popupsToReorder.map(({ id, order }) => `('${id}', ${order})`).join(', ');

    const result = await tx.execute(sql`
      UPDATE popups
      SET "order" = c.new_order
      FROM (VALUES ${sql.raw(values)}) AS c(id, new_order)
      WHERE popups.id = c.id::uuid AND popups.site_id = ${siteId}
      RETURNING *
    `);

    return result;
  });

  serverLogger.info({ type: "API", msg: "Reordered popups", details: { reorderPopups, user } });
  return updatedPopups;
}


export const createPopup = async ({ siteId }: { siteId: Site["id"] }) => {
  const user = await assertAuthenticated();

  // First, verify that the site belongs to the user
  const site = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.userId, user.id)
    )
  });

  if (!site) {
    throw new Error("Site not found or doesn't belong to the user");
  }

  // Now that we've verified ownership, create the popup
  const popup = await db.insert(popups).values({
    siteId,
  }).returning()

  serverLogger.info({ type: "API", msg: "Created popup", details: { popup: popup, user } });

  return popup; // Return the first (and only) inserted popup
};

export const editPopup = async ({ siteId, popup }: { siteId: Site["id"], popup: PopupUpdate }) => {
  const user = await assertAuthenticated();
  if (!user) {
    throw new Error("User not found");
  }

  const site = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.userId, user.id)
    )
  });

  if (!site) {
    throw new Error("Site not found or doesn't belong to the user");
  }

  const newPopup = await db.update(popups).set(popup).where(eq(popups.id, popup.id)).returning()

  serverLogger.info({ type: "API", msg: "Edited popup", details: { popup, user } });

  return newPopup
}

export const deletePopup = async ({ siteId, popupId }: { siteId: Site["id"], popupId: Popup["id"] }) => {
  const user = await assertAuthenticated();
  if (!user) {
    throw new Error("User not found");
  }

  const site = await db.query.sites.findFirst({
    where: and(
      eq(sites.id, siteId),
      eq(sites.userId, user.id)
    )
  });

  if (!site) {
    throw new Error("Site not found or doesn't belong to the user");
  }

  const deletedPopup = await db.delete(popups).where(and(eq(popups.id, popupId), eq(popups.siteId, siteId))).returning();
  serverLogger.info({ type: "API", msg: "Deleted popup", details: { deletedPopup, user } });

  return deletedPopup
}
