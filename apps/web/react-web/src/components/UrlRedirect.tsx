import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  LinkIcon 
} from '@heroicons/react/24/outline';

export const UrlRedirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setIsLoading(false);
      return;
    }

    // Call the existing redirect endpoint to get the original URL
    const fetchUrl = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/urls/go/${shortCode}`, {
          method: 'GET',
          redirect: 'manual', // Don't follow redirects automatically
        });

        if (response.url) {
          // Get the redirect location
          const location = response.url;
          if (location) {
            setOriginalUrl(location);
            // Redirect after a short delay to show the message
            setTimeout(() => {
              window.location.href = location;
            }, 1500);
          } else {
            setError('Redirect location not found');
          }
        } else if (response.status === 404) {
          setError('URL not found or has expired');
        } else {
          setError('Failed to load URL');
        }
      } catch (err) {
        console.log(err);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [shortCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <ArrowPathIcon className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Preparing your destination</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
            <ExclamationTriangleIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Create New Short URL
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (originalUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <LinkIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
          <p className="text-gray-600 mb-4">
            You're being redirected to:
          </p>
          <div className="bg-white p-4 rounded-lg border-2 border-green-200 mb-6">
            <p className="text-sm text-green-800 break-all font-medium">
              {originalUrl}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>If you're not redirected automatically,</p>
            <button
              onClick={() => window.location.href = originalUrl}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              click here
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
