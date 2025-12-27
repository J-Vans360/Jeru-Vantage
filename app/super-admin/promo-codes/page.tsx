'use client'

import { Ticket } from 'lucide-react'

export default function PromoCodesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
        <p className="text-gray-600 mt-1">Create and manage promotional discount codes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Promo code management will be available here. You&apos;ll be able to create
          discount codes with custom rules and track their usage.
        </p>
      </div>
    </div>
  )
}
