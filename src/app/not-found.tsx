import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-20 h-20 text-purple-600" />
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl" >
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
