import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Url } from '../types';
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const UrlList: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);
  const [editForm, setEditForm] = useState({ title: '', short_code: '' });
  const [editError, setEditError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const { data: urls, isLoading, error } = useQuery({
    queryKey: ['urls'],
    queryFn: () => apiService.getUserUrls(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateUrl(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      setEditingUrl(null);
      setEditForm({ title: '', short_code: '' });
      setEditError(null);
    },
    onError: (error) => {
      setEditError(error instanceof Error ? error.message : 'Failed to update URL');
    },
  });

  const handleCopy = async (url: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(shortCode);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEdit = (url: Url) => {
    setEditingUrl(url);
    setEditForm({
      title: url.title || '',
      short_code: url.short_code,
    });
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingUrl(null);
    setEditForm({ title: '', short_code: '' });
    setEditError(null);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUrl) return;
    
    updateMutation.mutate({
      id: editingUrl.id,
      data: {
        original_url: editingUrl.original_url,
        title: editForm.title,
        short_code: editForm.short_code,
      },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-800">Error loading URLs: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
        <p className="text-gray-500">Start by creating your first shortened URL!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {urls.map((url) => (
        <div key={url.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {editingUrl?.id === url.id ? (
            <div className="p-6 bg-gradient-to-br from-primary-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Edit URL</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Original URL (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original URL
                  </label>
                  <input
                    type="url"
                    value={editingUrl.original_url}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Title <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="My shortened URL"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                  />
                </div>

                {/* Short Code Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Short Code
                  </label>
                  <input
                    type="text"
                    value={editForm.short_code}
                    onChange={(e) => setEditForm({ ...editForm, short_code: e.target.value })}
                    placeholder="my-custom-code"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will change your shortened URL
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <p className="text-sm text-primary-600 font-mono">
                    {`${window.location.origin}/go/${editForm.short_code}`}
                  </p>
                </div>

                {editError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex">
                      <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="ml-3 text-red-800 text-sm">{editError}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    {updateMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <SparklesIcon className="h-5 w-5" />
                        <span>Save Changes</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {url.title || 'Untitled URL'}
                    </h3>
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                      {url.clicks} clicks
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Original URL:</p>
                      <p className="text-sm text-gray-600 break-all bg-gray-50 rounded-lg p-2 font-mono">
                        {url.original_url}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Shortened URL:</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-primary-600 font-mono bg-primary-50 rounded-lg p-2 flex-1">
                          {`${window.location.origin}/go/${url.short_code}`}
                        </p>
                        <button
                          onClick={() => handleCopy(`${window.location.origin}/go/${url.short_code}`, url.short_code)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            copied === url.short_code 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {copied === url.short_code ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 pt-2 border-t border-gray-100">
                      <span className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{url.clicks} clicks</span>
                      </span>
                      <span>Created: {new Date(url.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(url)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 