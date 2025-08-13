// components/Header.tsx
import { getCategories } from '@/lib/sahared-data/get-categories';
import Link from 'next/link';

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl text-amber-600 font-bold">New Project</span>
        </Link>

        {/* Навигация */}
        <ul
          className="hidden md:flex space-x-8"
          data-testid="header-nav-categories"
        >
          {!categories ? (
            <p className="text-red-600  text-sm font-medium mt-1">
              ⚠️ Что пошло не так
            </p>
          ) : categories.length === 0 ? (
            <p className="text-lg  text-gray-500">Данных нет</p>
          ) : (
            categories.map((category) => {
              return (
                <li
                  key={category.id}
                  className="text-gray-700 hover:text-amber-600 transition-colors font-medium"
                >
                  {category.name}
                </li>
              );
            })
          )}
        </ul>

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
