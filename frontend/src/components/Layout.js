import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
    }}>
      {/* Белые градиентные круги на фоне */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute top-1/3 right-20 w-80 h-80 rounded-full opacity-4"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, transparent 60%)'
          }}
        />
        <div 
          className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full opacity-6"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 30%, transparent 55%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full opacity-4"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 25%, transparent 50%)'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;