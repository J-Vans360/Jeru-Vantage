'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Download,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Zap,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  periodStart: Date;
  periodEnd: Date;
  totalLeads: number;
  total: number;
  status: string;
  dueDate: Date;
  paidAt: Date | null;
}

interface BillingDashboardProps {
  university: {
    name: string;
    tier: string;
    subscriptionType: string;
    cplRate: number;
    annualFee: number;
    contractStart: Date;
    contractEnd: Date;
  };
  summary: {
    totalPaid: number;
    totalPending: number;
    unbilledLeads: number;
    unbilledAmount: number;
  };
  invoices: Invoice[];
}

const statusConfig: Record<
  string,
  { color: string; icon: typeof FileText; label: string }
> = {
  DRAFT: { color: 'bg-gray-100 text-gray-700', icon: FileText, label: 'Draft' },
  PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
  PAID: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Paid' },
  OVERDUE: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Overdue' },
  CANCELLED: { color: 'bg-gray-100 text-gray-500', icon: FileText, label: 'Cancelled' },
};

const tierBadges: Record<string, { bg: string; text: string; label: string }> = {
  STANDARD: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Standard' },
  SILVER: { bg: 'bg-gray-200', text: 'text-gray-800', label: 'Silver' },
  GOLD: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Gold' },
  PLATINUM: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Platinum' },
};

export default function BillingDashboard({
  university,
  summary,
  invoices,
}: BillingDashboardProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const tier = tierBadges[university.tier] || tierBadges.STANDARD;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and view invoices</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.text}`}
              >
                {tier.label}
              </span>
              <span className="text-white/80 text-sm">Partner</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{university.name}</h2>
            <p className="text-white/80">
              {university.subscriptionType === 'CPL'
                ? `Cost Per Lead: $${university.cplRate}/lead`
                : university.subscriptionType === 'SAAS'
                  ? `Annual Subscription: $${university.annualFee?.toLocaleString()}/year`
                  : 'Custom Agreement'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-sm text-white/80">
              Contract: {format(new Date(university.contractStart), 'MMM yyyy')} -{' '}
              {format(new Date(university.contractEnd), 'MMM yyyy')}
            </div>
            {university.tier !== 'PLATINUM' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Paid"
          value={`$${summary.totalPaid.toLocaleString()}`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <SummaryCard
          title="Pending Payment"
          value={`$${summary.totalPending.toLocaleString()}`}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <SummaryCard
          title="Unbilled Leads"
          value={summary.unbilledLeads.toString()}
          subtitle="Current period"
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <SummaryCard
          title="Unbilled Amount"
          value={`$${summary.unbilledAmount.toLocaleString()}`}
          subtitle="Estimated"
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                  const StatusIcon = status.icon;

                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(invoice.periodStart), 'MMM d')} -{' '}
                        {format(new Date(invoice.periodEnd), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.totalLeads} leads
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          ${invoice.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {invoice.status === 'PENDING' && (
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No invoices yet</p>
            <p className="text-sm">Invoices will appear here once you start receiving leads</p>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">**** **** **** 4242</div>
              <div className="text-sm text-gray-500">Expires 12/25</div>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Update
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Invoices are automatically charged to this card on the due date.
        </p>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal currentTier={university.tier} onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'green' | 'yellow' | 'blue' | 'purple';
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

// Upgrade Modal Component
function UpgradeModal({ currentTier, onClose }: { currentTier: string; onClose: () => void }) {
  const plans = [
    {
      tier: 'SILVER',
      name: 'Silver',
      price: '$500/mo',
      features: [
        'Win ties within 5% score margin',
        'Priority email support',
        'Monthly analytics report',
      ],
    },
    {
      tier: 'GOLD',
      name: 'Gold',
      price: '$1,000/mo',
      popular: true,
      features: [
        'Win ties within 7% score margin',
        'Featured badge on profile',
        'Dedicated account manager',
        'Weekly analytics report',
        'Custom matching criteria',
      ],
    },
    {
      tier: 'PLATINUM',
      name: 'Platinum',
      price: '$2,500/mo',
      features: [
        'Win ties within 10% score margin',
        'Hero placement priority',
        'White-glove onboarding',
        'Real-time analytics dashboard',
        'API access',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <p className="text-gray-600 mt-1">Get more leads with priority placement</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.tier === currentTier;

            return (
              <div
                key={plan.tier}
                className={`rounded-xl border-2 p-5 relative ${
                  plan.popular ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
                } ${isCurrent ? 'opacity-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
