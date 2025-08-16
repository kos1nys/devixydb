import React, { useState } from 'react';

const SearchBox = ({ onSearch, placeholder = "Поиск по ID Discord или нику..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="border-2 border-white/30 rounded-lg p-6 mb-8 backdrop-blur-sm" style={{
      background: 'rgba(15, 15, 15, 0.9)'
    }}>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-5 py-3 rounded-full border-2 border-white/30 text-white text-lg outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all" 
          style={{
            background: 'rgba(0, 0, 0, 0.7)'
          }}
        />
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold rounded-full transition-all transform hover:scale-105 hover:shadow-lg border-2 border-white/20"
        >
          <i className="fas fa-search mr-2"></i>
          Найти
        </button>
      </form>
    </div>
  );
};

export default SearchBox;