import React from 'react';

const Header = ({ title, subtitle, showStats = false, stats = null }) => {
  return (
    <div className="text-center py-8 border-b border-gray-200 mb-8">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        <i className="fas fa-code mr-3"></i>
        {title}
      </h1>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
          <div 
            className="rounded-lg p-6 backdrop-blur-sm border border-gray-200 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h3 className="text-gray-500 text-sm font-medium mb-2">Всего записей</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.total_records || 0}
            </div>
          </div>
          <div 
            className="rounded-lg p-6 backdrop-blur-sm border border-gray-200 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h3 className="text-gray-500 text-sm font-medium mb-2">Активные угрозы</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.active_threats || 0}
            </div>
          </div>
          <div 
            className="rounded-lg p-6 backdrop-blur-sm border border-gray-200 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h3 className="text-gray-500 text-sm font-medium mb-2">Проверено</h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.verified || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;