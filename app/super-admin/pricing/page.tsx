'use client'

import { DollarSign } from 'lucide-react'

export default function PricingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="text-gray-600 mt-1">Configure subscription tiers and pricing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Pricing plan configuration will be available here. You&apos;ll be able to create
          and manage subscription tiers for schools and sponsors.
        </p>
      </div>
    </div>
  )
}
