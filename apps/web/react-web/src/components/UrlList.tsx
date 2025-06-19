import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Url } from '../types';
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

export const UrlList: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);
  const [editForm, setEditForm] = useState({ title: '', short_code: '' });
  
  const queryClient = useQueryClient();

  const { data: urls, isLoading, error } = useQuery({
    queryKey: ['urls'],
    queryFn: apiService.getUserUrls,
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
  };

  const handleUpdate = () => {
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading URLs: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
        <p className="text-gray-500">Start by creating your first shortened URL!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <div key={url.id} className="bg-white shadow rounded-lg p-6">
          {editingUrl?.id === url.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
                <input
                  type="text"
                  value={editForm.short_code}
                  onChange={(e) => setEditForm({ ...editForm, short_code: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="btn-primary"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditingUrl(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {url.title || 'Untitled URL'}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Original URL:</p>
                      <p className="text-sm text-gray-900 break-all">{url.original_url}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shortened URL:</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-primary-600 font-medium">
                          {`${window.location.origin}/go/${url.short_code}`}
                        </p>
                        <button
                          onClick={() => handleCopy(`${window.location.origin}/go/${url.short_code}`, url.short_code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copied === url.short_code ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                    className="text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}; 