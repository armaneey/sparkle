import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Sparkle & Shine
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your magical gateway to a beautiful, secure online experience 
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl" >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-300 rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all font-medium shadow-md hover:shadow-lg"  >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
