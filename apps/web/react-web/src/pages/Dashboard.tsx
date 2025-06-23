import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  LinkIcon, 
  ChartBarIcon, 
  PlusIcon,
  EyeIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import type { Url } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL creation form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    original_url: '',
    title: '',
    short_code: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<Url | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getUserUrls();
        setUrls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load URLs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateFormData(prev => ({ ...prev, short_code: result }));
  };

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.original_url) return;

    try {
      setIsCreating(true);
      setCreateError(null);
      
      const data = {
        original_url: createFormData.original_url,
        title: createFormData.title || undefined,
        short_code: createFormData.short_code || undefined
      };

      const newUrl = await apiService.shortenUrl(data);
      setCreatedUrl(newUrl);
      
      // Refresh the URLs list
      const updatedUrls = await apiService.getUserUrls();
      setUrls(updatedUrls);
      
      // Reset form
      setCreateFormData({ original_url: '', title: '', short_code: '' });
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create URL');
    } finally {
      setIsCreating(false);
    }
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

  const totalClicks = urls.reduce((sum, url) => sum + Number(url.clicks), 0);

  const recentUrls = urls.slice(0, 5);

  const stats = [
    {
      name: 'Total URLs',
      value: isLoading ? '...' : urls.length,
      icon: LinkIcon,
      color: 'bg-primary-500',
    },
    {
      name: 'Total Clicks',
      value: isLoading ? '...' : totalClicks,
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'This Month',
      value: isLoading ? '...' : recentUrls.length,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your URLs today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create URL Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New URL</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{showCreateForm ? 'Cancel' : 'Add URL'}</span>
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="p-6 bg-gradient-to-br from-primary-50 to-white">
            <form onSubmit={handleCreateUrl} className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="original_url" className="block text-sm font-semibold text-gray-700 mb-2">
                  Long URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="original_url"
                  value={createFormData.original_url}
                  onChange={(e) => setCreateFormData({ ...createFormData, original_url: e.target.value })}
                  placeholder="https://example.com/very-long-url"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                  required
                />
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Title <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                  placeholder="My shortened URL"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                />
              </div>

              {/* Short Code Input */}
              <div>
                <label htmlFor="short_code" className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Short Code <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="short_code"
                    value={createFormData.short_code}
                    onChange={(e) => setCreateFormData({ ...createFormData, short_code: e.target.value })}
                    placeholder="my-custom-code"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for auto-generated code
                </p>
              </div>

              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm">{createError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating || !createFormData.original_url}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Create Short URL</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </div>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Success Message */}
      {createdUrl && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800">URL created successfully!</h3>
              <p className="text-sm text-green-600">Your shortened URL is ready to use</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={`${window.location.origin}/go/${createdUrl.short_code}`}
                readOnly
                className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-green-800 font-mono text-sm focus:outline-none"
              />
              <button
                onClick={() => handleCopy(`${window.location.origin}/go/${createdUrl.short_code}`)}
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
              <span>Original: {createdUrl.original_url}</span>
              <span className="bg-green-100 px-3 py-1 rounded-full font-medium">
                {createdUrl.clicks || 0} clicks
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent URLs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent URLs</h2>
            <Link
              to="/urls"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View all →
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading URLs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recentUrls.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first shortened URL</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create First URL
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUrls.map((url) => (
                <div key={url.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/30 transition-all">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {url.title || 'Untitled URL'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{url.original_url}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-400 font-mono">
                        {`${window.location.origin}/go/${url.short_code}`}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {url.clicks} clicks
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/urls/${url.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 ml-4 font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 