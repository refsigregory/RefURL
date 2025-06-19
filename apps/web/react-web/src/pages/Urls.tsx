import { UrlList } from '../components/UrlList';

export const Urls: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My URLs</h1>
        <p className="text-gray-600">Manage and track all your shortened URLs</p>
      </div>
      
      <UrlList />
    </div>
  );
}; 