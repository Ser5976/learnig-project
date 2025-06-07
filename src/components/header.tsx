// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl text-amber-600 font-bold">New Project</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Кнопки действий */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-gray-700 hover:text-amber-600 transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
