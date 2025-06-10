import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} Learning Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
