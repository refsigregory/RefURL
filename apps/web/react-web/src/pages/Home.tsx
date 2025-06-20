import { Link } from 'react-router-dom';
import { UrlShortener } from '../components/UrlShortener';
import { useAuth } from '../hooks/useAuth';
import { 
  LinkIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: LinkIcon,
      title: 'Fast URL Shortening',
      description: 'Create short, memorable links in seconds.',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Track clicks and monitor performance.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and reliability.',
    },
    {
      icon: BoltIcon,
      title: 'Custom Short Codes',
      description: 'Create branded short codes for your brand.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Shorten URLs with
          <span className="text-primary-600"> Confidence</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Transform long URLs into short, shareable links. Track performance, 
          manage your links, and boost your online presence.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* URL Shortener Section */}
      <div>
        <UrlShortener />
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose RefURL?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technology and best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of users who trust RefURL.
        </p>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Free Account
          </Link>
        )}
      </div>
    </div>
  );
}; 