// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSettings, FiUser, FiFileText, FiMail } from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <FiHome size={20} />, label: 'Главная' },
    { href: '/profile', icon: <FiUser size={20} />, label: 'Профиль' },
    { href: '#', icon: <FiFileText size={20} />, label: 'Документы' },
    { href: '#', icon: <FiMail size={20} />, label: 'Сообщения' },
    { href: '#', icon: <FiSettings size={20} />, label: 'Настройки' },
  ];

  return (
    <aside className="  w-64 bg-white shadow-md  ">
      {/* Логотип */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-amber-600">MyApp</h1>
      </div>

      {/* Навигация */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-amber-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Нижний блок (опционально) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-gray-500">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span>Пользователь</span>
        </div>
      </div>
    </aside>
  );
}
