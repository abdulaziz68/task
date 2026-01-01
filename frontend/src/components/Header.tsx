import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Engineering PM</h1>
        <nav className="space-x-4 space-x-reverse">
          <a href="#" className="hover:text-accent transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-accent transition-colors">المشاريع</a>
          <a href="#" className="hover:text-accent transition-colors">الإعدادات</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
