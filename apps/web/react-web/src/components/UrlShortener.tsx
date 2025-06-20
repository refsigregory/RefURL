import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { CreateUrlRequest } from '../types';
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  LinkIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export const UrlShortener: React.FC = () => {
  const [formData, setFormData] = useState<CreateUrlRequest>({
    original_url: '',
    title: '',
  });
  const [copied, setCopied] = useState(false);

  const shortenMutation = useMutation({
    mutationFn: (data: CreateUrlRequest) => apiService.shortenUrl(data),
    onSuccess: () => {
      setFormData({ original_url: '', title: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.original_url) return;
    
    shortenMutation.mutate(formData);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shortUrl = shortenMutation.data 
    ? `${window.location.origin}/go/${shortenMutation.data.short_code}`
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Container with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100/30 rounded-3xl shadow-2xl border border-primary-100/50">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-primary-400/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Shorten Your URL
            </h2>
            <p className="text-gray-600 text-lg">
              Transform long links into short, shareable URLs instantly
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div className="relative group">
              <label htmlFor="original_url" className="block text-sm font-semibold text-gray-700 mb-3">
                Long URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="original_url"
                  value={formData.original_url}
                  onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                  placeholder={`example.com/very-long-url`}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-400 group-hover:border-gray-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Title Input */}
            <div className="relative group">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                Custom Title <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="My shortened URL"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-400 group-hover:border-gray-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={shortenMutation.isPending || !formData.original_url}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {shortenMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Shorten URL</span>
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Error Message */}
          {shortenMutation.error && (
            <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      {shortenMutation.error instanceof Error ? shortenMutation.error.message : 'Failed to shorten URL'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {shortUrl && (
            <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-green-800">Your shortened URL is ready!</h3>
                    <p className="text-sm text-green-600">Share this link with anyone</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-green-800 font-mono text-sm focus:outline-none focus:border-green-300"
                    />
                    <button
                      onClick={() => handleCopy(shortUrl)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        copied 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-white text-green-600 border-2 border-green-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {copied ? (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <ClipboardDocumentIcon className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Original: {shortenMutation.data?.original_url}</span>
                    <span className="bg-green-100 px-3 py-1 rounded-full font-medium">
                      {shortenMutation.data?.clicks || 0} clicks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 