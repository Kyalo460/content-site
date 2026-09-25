import { motion } from 'framer-motion';
import { DollarSign, CreditCard, RefreshCw, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
          Orders
        </h1>
        <p className="text-body-lg text-charcoal-500">
          Payment integration required for orders management
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
        <DollarSign className="w-16 h-16 text-cream-300 mx-auto mb-4" />
        <h2 className="font-display text-heading-lg text-charcoal-900 mb-2">
          Orders Unavailable
        </h2>
        <p className="text-body text-charcoal-500 mb-6 max-w-md mx-auto">
          Orders and payment management requires Stripe integration. 
          Configure Stripe credentials to enable this feature.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-charcoal-500">
          <span className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            Stripe payments
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-4 h-4" />
            Order processing
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Refund management
          </span>
        </div>
      </div>
    </div>
  );
}