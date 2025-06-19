import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  LinkIcon, 
  ChartBarIcon, 
  PlusIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: urls, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: apiService.getUserUrls,
  });

  const totalClicks = urls?.reduce((sum, url) => sum + url.clicks, 0) || 0;
  const recentUrls = urls?.slice(0, 5) || [];

  const stats = [
    {
      name: 'Total URLs',
      value: urls?.length || 0,
      icon: LinkIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Clicks',
      value: totalClicks,
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'This Month',
      value: recentUrls.length,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your URLs today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <PlusIcon className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Create New URL</h3>
              <p className="text-sm text-gray-600">Shorten a new URL</p>
            </div>
          </Link>
          <Link
            to="/urls"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <LinkIcon className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Manage URLs</h3>
              <p className="text-sm text-gray-600">View and edit your URLs</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent URLs */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent URLs</h2>
          <Link
            to="/urls"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recentUrls.length === 0 ? (
          <div className="text-center py-8">
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first shortened URL</p>
            <Link
              to="/"
              className="btn-primary"
            >
              Create First URL
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUrls.map((url) => (
              <div key={url.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {url.title || 'Untitled URL'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{url.original_url}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-400">
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
                  className="text-sm text-primary-600 hover:text-primary-500 ml-4"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 