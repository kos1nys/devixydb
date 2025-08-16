import React from 'react';

const Header = ({ title, subtitle, showStats = false, stats = null }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '30px 0',
      borderBottom: '1px solid #333',
      marginBottom: '30px',
      position: 'relative'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '10px',
        background: 'linear-gradient(to right, #ffffff, #cccccc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        margin: 0,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <i className="fas fa-code mr-3"></i>
        {title}
      </h1>
      <div style={{
        fontSize: '1.1rem',
        color: '#aaa',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        {subtitle}
      </div>
      
      {showStats && stats && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          marginBottom: '0',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            borderRadius: '10px',
            padding: '20px',
            flex: '1',
            minWidth: '200px',
            textAlign: 'center',
            border: '1px solid #333',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#aaa',
              marginBottom: '10px',
              margin: 0,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>Всего записей</h3>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(to right, #ffffff, #cccccc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats.total_records || 0}
            </div>
          </div>
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            borderRadius: '10px',
            padding: '20px',
            flex: '1',
            minWidth: '200px',
            textAlign: 'center',
            border: '1px solid #333',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#aaa',
              marginBottom: '10px',
              margin: 0,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>Активные угрозы</h3>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#ff6b6b'
            }}>
              {stats.active_threats || 0}
            </div>
          </div>
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            borderRadius: '10px',
            padding: '20px',
            flex: '1',
            minWidth: '200px',
            textAlign: 'center',
            border: '1px solid #333',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#aaa',
              marginBottom: '10px',
              margin: 0,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>Проверено</h3>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#6bff6b'
            }}>
              {stats.verified || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;