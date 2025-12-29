'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('code') || '';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Jeru Vantage Partner Program
        </p>

        {/* Referral Code Box */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
          <p className="text-sm text-orange-700 mb-2">Your Unique Referral Code</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-orange-600 tracking-wider">
              {referralCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-orange-600'}`} />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>

        {/* Pending Approval Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium text-amber-800">Account Pending Approval</h3>
              <p className="text-sm text-amber-700 mt-1">
                Your account is currently under review. Once approved, you can start referring schools
                and earning commissions. We&apos;ll notify you via email within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Our team will review your application</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>You&apos;ll receive an approval email with login details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Start sharing your referral code with schools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span>Earn 10-15% commission on every subscription</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/partner/login"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Go to Partner Login
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PartnerRegisterSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
