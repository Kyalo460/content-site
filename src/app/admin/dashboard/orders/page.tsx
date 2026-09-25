import { prisma } from '@/lib/prisma';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Eye, DollarSign, CreditCard, RefreshCw, XCircle } from 'lucide-react';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      customer: true,
      items: { include: { product: true } },
      payment: true,
    },
  });

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-rose-100 text-rose-700',
    REFUNDED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
  } as const;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
          Orders
        </h1>
        <p className="text-body-lg text-charcoal-500">
          Manage customer orders and payments
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-caption font-medium text-charcoal-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-charcoal-500">
                    <DollarSign className="w-12 h-12 text-cream-300 mx-auto mb-4" />
                    <p className="text-body">No orders yet</p>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-charcoal-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-body-sm text-charcoal-500">{order.stripeSessionId?.slice(0, 20)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-charcoal-900">{order.customer.name || 'Guest'}</p>
                        <p className="text-body-sm text-charcoal-500">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <span key={item.id} className="px-2 py-1 bg-cream-100 rounded-full text-caption text-charcoal-600">
                            {item.product.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-display text-heading-sm text-charcoal-900">
                        {formatCurrency(order.totalCents)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-caption font-medium',
                        statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                      )}>
                        {order.status === 'PENDING' && <RefreshCw className="w-3 h-3 animate-spin mr-1" />}
                        {order.status === 'FAILED' && <XCircle className="w-3 h-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.payment ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-caption font-medium bg-blue-100 text-blue-700">
                          <CreditCard className="w-3 h-3" />
                          Stripe
                        </span>
                      ) : (
                        <span className="text-body-sm text-charcoal-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-charcoal-500">
                      {formatRelativeTime(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-xl text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-colors" aria-label="View order details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}