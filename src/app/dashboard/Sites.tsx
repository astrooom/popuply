import { getSites } from "@/lib/api/sites";
import { Site, MobileSite } from "./Site";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
// Sites component
export async function Sites() {
  const sites = await getSites();

  return (
    <div>
      <h2 className="lg:text-3xl text-2xl font-bold mb-4">Your Sites</h2>
      {sites.length === 0 ? (
        <p className="text-muted-foreground">You don&apos;t have any sites yet.</p>
      ) : (
        <>
          {/* Mobile view */}
          <div className="md:hidden">
            {sites.map((site) => (
              <MobileSite key={site.id} site={site} />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead className="sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <Site key={site.id} site={site} />
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}