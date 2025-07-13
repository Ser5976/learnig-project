'use client';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useEffect, useState } from 'react';

interface SimpleCardProps {
  title: string;
  showButton?: boolean;
}

const getUser = (): Promise<{ id: number; name: string }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'ivan' });
    }, 3000);
  });

export function SimpleCard({ title, showButton = true }: SimpleCardProps) {
  const [value, setValue] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string }>(
    {} as { id: number; name: string }
  );

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    loadUser();
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handelCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(e.target.checked);
  };
  return (
    <div
      className="bg-white shadow-sm p-4 border border-amber-600 rounded-lg"
      data-testid="simple-card"
    >
      <h2 className="mb-2 font-semibold text-xl">{title}</h2>

      <label className="inline-flex items-center gap-2 cursor-pointer">
        <Input
          type="checkbox"
          className="border-gray-300 rounded w-4 h-4"
          onChange={handelCheckbox}
        />
        <span>{checkbox ? 'Принять условия' : 'Не принять условия'}</span>
      </label>
      <Input
        placeholder="поиск..."
        type="text"
        value={value}
        onChange={handleChange}
        className="border-amber-500 focus-within:ring-amber-500 w-[50%]"
      />

      <p className="my-4 mb-4 text-gray-600">
        Вывод текста: {value ? value : '     ...'}
      </p>
      <div className="mb-4 h-4">
        {user.name ? (
          <p className="my-4 mb-4 text-gray-600">
            Имя пользователя: {user.name}
          </p>
        ) : null}
      </div>

      {showButton && (
        <button
          className="bg-amber-600 hover:bg-amber-800 px-4 py-2 rounded text-white"
          aria-label="Action button"
        >
          Click me
        </button>
      )}
    </div>
  );
}
