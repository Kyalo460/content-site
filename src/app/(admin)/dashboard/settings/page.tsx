'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Shield, Image, Globe, CreditCard, MessageSquare, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: Shield },
  { id: 'branding', label: 'Branding', icon: Image },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'site', label: 'Site', icon: Globe },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
          Settings
        </h1>
        <p className="text-body-lg text-charcoal-500">
          Configure your platform settings
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="border-b border-cream-200 overflow-x-auto">
          <nav className="flex gap-1 px-4" role="tablist" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-body-sm font-medium transition-all duration-200 border-b-2 -mb-px',
                    isActive
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <motion.div
              id="panel-profile"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="font-display text-heading-lg text-charcoal-900">Profile Settings</h2>
              <form className="space-y-6" onSubmit={async (e) => { e.preventDefault(); setIsSaving(true); await new Promise(r => setTimeout(r, 1000)); setIsSaving(false); }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">Display Name</label>
                    <input type="text" id="name" className="input" defaultValue="Shirlene" />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input type="email" id="email" className="input" defaultValue="admin@shirlene.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="label">Bio</label>
                  <textarea id="bio" className="input min-h-[100px] resize-y" defaultValue="Premium content creator sharing exclusive experiences." />
                </div>
                <div className="pt-4 border-t border-cream-200 flex gap-4">
                  <button type="submit" disabled={isSaving} className="btn-primary">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button type="button" className="btn-outline">Change Password</button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div
              id="panel-branding"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="font-display text-heading-lg text-charcoal-900">Branding & Appearance</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="siteName" className="label">Site Name</label>
                  <input type="text" id="siteName" className="input" defaultValue="Shirlene" />
                </div>
                <div>
                  <label htmlFor="heroTitle" className="label">Hero Title</label>
                  <input type="text" id="heroTitle" className="input" defaultValue="Shirlene" />
                </div>
                <div>
                  <label htmlFor="heroSubtitle" className="label">Hero Subtitle</label>
                  <input type="text" id="heroSubtitle" className="input" defaultValue="Exclusive content & intimate experiences" />
                </div>
                <div>
                  <label htmlFor="heroImage" className="label">Hero Image URL</label>
                  <input type="url" id="heroImage" className="input" placeholder="https://..." />
                </div>
                <div>
                  <label htmlFor="siteDescription" className="label">Site Description (SEO)</label>
                  <textarea id="siteDescription" className="input min-h-[80px] resize-y" defaultValue="Premium creator platform with exclusive content." />
                </div>
                <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Branding</button>
              </form>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              id="panel-contact"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="font-display text-heading-lg text-charcoal-900">Contact Settings</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="whatsappNumber" className="label">WhatsApp Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400">+</span>
                    <input type="tel" id="whatsappNumber" className="input pl-8" placeholder="15551234567" />
                  </div>
                  <p className="mt-1 text-body-sm text-charcoal-500">International format without + (e.g., 15551234567)</p>
                </div>
                <div>
                  <label htmlFor="whatsappMessage" className="label">Default WhatsApp Message</label>
                  <input type="text" id="whatsappMessage" className="input" defaultValue="Hi Shirlene! I'd love to connect." />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="label">Contact Email</label>
                  <input type="email" id="contactEmail" className="input" placeholder="support@shirlene.com" />
                </div>
                <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Contact Info</button>
              </form>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              id="panel-payments"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="font-display text-heading-lg text-charcoal-900">Payment Configuration</h2>
              <div className="bg-cream-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-heading-md text-charcoal-900">Stripe Integration</h3>
                    <p className="text-body-sm text-charcoal-500">Configure your Stripe keys for payment processing</p>
                  </div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="stripePublishableKey" className="label">Publishable Key</label>
                    <input type="text" id="stripePublishableKey" className="input" placeholder="pk_test_..." />
                  </div>
                  <div>
                    <label htmlFor="stripeSecretKey" className="label">Secret Key</label>
                    <input type="password" id="stripeSecretKey" className="input" placeholder="sk_test_..." />
                    <p className="mt-1 text-body-sm text-charcoal-500">Stored securely, never exposed to frontend</p>
                  </div>
                  <div>
                    <label htmlFor="stripeWebhookSecret" className="label">Webhook Secret</label>
                    <input type="text" id="stripeWebhookSecret" className="input" placeholder="whsec_..." />
                    <p className="mt-1 text-body-sm text-charcoal-500">From Stripe Dashboard → Webhooks</p>
                  </div>
                  <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Stripe Config</button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'site' && (
            <motion.div
              id="panel-site"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="font-display text-heading-lg text-charcoal-900">Site Configuration</h2>
              <form className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-cream-300 text-rose-600 focus:ring-rose-500" defaultChecked />
                    <span className="font-medium text-charcoal-900">Age Gate Enabled</span>
                  </label>
                </div>
                <div>
                  <label htmlFor="ageGateMessage" className="label">Age Gate Message</label>
                  <textarea id="ageGateMessage" className="input min-h-[80px] resize-y" defaultValue="This site contains mature content. You must be 18+ to enter." />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="termsUrl" className="label">Terms of Service URL</label>
                    <input type="url" id="termsUrl" className="input" placeholder="/legal/terms" />
                  </div>
                  <div>
                    <label htmlFor="privacyUrl" className="label">Privacy Policy URL</label>
                    <input type="url" id="privacyUrl" className="input" placeholder="/legal/privacy" />
                  </div>
                  <div>
                    <label htmlFor="refundUrl" className="label">Refund Policy URL</label>
                    <input type="url" id="refundUrl" className="input" placeholder="/legal/refund" />
                  </div>
                </div>
                <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Site Config</button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}