import React, { useState } from 'react';

const SearchBox = ({ onSearch, placeholder = "Поиск по ID Discord или нику..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div style={{
      background: 'rgba(30, 30, 30, 0.8)',
      borderRadius: '10px',
      padding: '25px',
      marginBottom: '30px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
      border: '1px solid #333'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '15px'
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: '1',
            padding: '15px 20px',
            borderRadius: '50px',
            border: '1px solid #444',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#666';
            e.target.style.boxShadow = '0 0 10px rgba(100, 100, 100, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(to right, #333, #555)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #444, #666)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #333, #555)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-search mr-2"></i>
          Найти
        </button>
      </form>
    </div>
  );
};

export default SearchBox;