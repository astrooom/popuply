import { isCurrentUserValid } from "@/lib/auth/session"
import { DashboardNavbar } from "../DashboardNavbar"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { desc, eq } from "drizzle-orm"
import { orders } from "@/db/schema"
import { getCurrentUser } from "@/lib/auth/session"
import { formatDistanceToNow } from "date-fns" // You might need to install this package
import { PRODUCTS } from "@/lib/constants/checkout"

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) {
    return redirect("/login")
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      user: true,
    },
  })

  return (
    <>
      <DashboardNavbar />
      <div className="container">
        <div className="pt-32 pb-12 mx-auto w-full max-w-4xl flex flex-col gap-y-8">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          {userOrders.length === 0 ? (
            <p>You haven&apos;t placed any orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {userOrders.map((order) => {
                    const matchedProduct = PRODUCTS.find((p) => p.pricingId === order.pricingId)
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {matchedProduct?.name ?? "Unknown product".replace(/_/g, " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${matchedProduct?.price}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
