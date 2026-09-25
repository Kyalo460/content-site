import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Purchase Successful',
  description: 'Thank you for your purchase! Your content is now unlocked.',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="section bg-cream-50 min-h-[calc(100vh-200px)] flex items-center">
      <div className="container-custom">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">
            Purchase Complete!
          </h1>

          <p className="text-body-lg text-charcoal-500 mb-10">
            Thank you for your purchase. Your premium content has been unlocked and is ready to enjoy.
          </p>

          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rose-600" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-heading-md text-charcoal-900">
                  What's Next?
                </h3>
                <p className="text-body-sm text-charcoal-500">
                  Access your content immediately
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-3 text-body text-charcoal-600">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </span>
                Content unlocked in your library
              </li>
              <li className="flex items-center gap-3 text-body text-charcoal-600">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </span>
                Confirmation email sent
              </li>
              <li className="flex items-center gap-3 text-body text-charcoal-600">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </span>
                Access never expires for one-time purchases
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/collections"
              className="btn-gold px-8 py-3 group"
            >
              Browse More Content
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/"
              className="btn-outline px-8 py-3"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}