'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, CheckCircle, AlertCircle, Loader2,
  ArrowRight, Sparkles, Users, Lock
} from 'lucide-react';

interface InviteCodeGateProps {
  onValidCode: (code: string, sourceName?: string) => void;
}

export default function InviteCodeGate({ onValidCode }: InviteCodeGateProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [error, setError] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null);

  const validateCode = async () => {
    if (!code.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setStatus('validating');
    setError('');

    try {
      const res = await fetch('/api/pilot/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.valid) {
        setStatus('valid');
        setSourceName(data.sourceName || '');
        setSpotsRemaining(data.spotsRemaining);

        // Short delay to show success state
        setTimeout(() => {
          onValidCode(data.code, data.sourceName);
        }, 1000);
      } else {
        setStatus('invalid');
        setError(data.error || 'Invalid code');
      }
    } catch {
      setStatus('invalid');
      setError('Failed to validate code. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Jeru Vantage Pilot
          </h1>
          <p className="text-gray-600">
            Enter your invite code to access the free assessment
          </p>
        </div>

        {/* Code Input Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Invite Only Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-full px-4 py-2 mb-6">
            <Lock className="w-4 h-4" />
            <span>Invite-only pilot program</span>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setStatus('idle');
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="e.g., COUN-SARAH-SG"
                disabled={status === 'validating' || status === 'valid'}
                className={`
                  w-full pl-12 pr-4 py-4 border-2 rounded-xl text-lg font-mono uppercase
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${status === 'valid' ? 'border-green-500 bg-green-50' : ''}
                  ${status === 'invalid' ? 'border-red-500 bg-red-50' : 'border-gray-200'}
                `}
              />

              {/* Status Icon */}
              {status === 'validating' && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
              )}
              {status === 'valid' && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {status === 'invalid' && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {status === 'valid' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                <CheckCircle className="w-5 h-5" />
                Code Accepted!
              </div>
              {sourceName && (
                <p className="text-green-600 text-sm">
                  Invited by: {sourceName}
                </p>
              )}
              {spotsRemaining !== null && (
                <p className="text-green-600 text-sm">
                  {spotsRemaining} spots remaining
                </p>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            onClick={validateCode}
            disabled={status === 'validating' || status === 'valid' || !code.trim()}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all
              ${status === 'valid'
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {status === 'validating' && (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validating...
              </>
            )}
            {status === 'valid' && (
              <>
                <CheckCircle className="w-5 h-5" />
                Redirecting...
              </>
            )}
            {(status === 'idle' || status === 'invalid') && (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Don&apos;t have a code?
          </p>
          <p className="text-gray-600 text-sm">
            Contact your school counselor or email us at{' '}
            <a href="mailto:pilot@jeruvantage.com" className="text-blue-600 hover:underline">
              pilot@jeruvantage.com
            </a>
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>500+ students joined</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>100% Free</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
