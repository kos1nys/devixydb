import React from 'react';

const ScammerTable = ({ 
  scammers, 
  onViewDetails, 
  onEdit = null, 
  onDelete = null, 
  showActions = true 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600'
    };
    
    if (status === 'active') {
      return {
        ...baseStyle,
        background: 'rgba(200, 0, 0, 0.2)',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b'
      };
    } else {
      return {
        ...baseStyle,
        background: 'rgba(0, 200, 0, 0.2)',
        color: '#6bff6b',
        border: '1px solid #6bff6b'
      };
    }
  };

  return (
    <div style={{
      background: 'rgba(25, 25, 25, 0.9)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      border: '1px solid #333',
      marginBottom: '30px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        background: 'rgba(40, 40, 40, 0.9)',
        borderBottom: '1px solid #333'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#ddd',
          margin: 0,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <i className="fas fa-database mr-2"></i>
          Список мошенников
        </h2>
        <div style={{
          fontSize: '1.1rem',
          color: '#aaa',
          alignSelf: 'center'
        }}>
          Записей: <span style={{ color: '#fff', fontWeight: 'normal' }}>{scammers.length}</span>
        </div>
      </div>

      {scammers.length === 0 ? (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          color: '#aaa'
        }}>
          <i className="fas fa-search" style={{ fontSize: '4rem', marginBottom: '16px', display: 'block' }}></i>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>Мошенники не найдены</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            <thead>
              <tr>
                <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>ID Discord</th>
                <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>Ник Discord</th>
                <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>Метод обмана</th>
                <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>Дата добавления</th>
                <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>Статус</th>
                {showActions && <th style={{
                  background: 'rgba(50, 50, 50, 0.9)',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#ddd',
                  borderBottom: '1px solid #333'
                }}>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {scammers.map((scammer, index) => (
                <tr 
                  key={scammer.id}
                  style={{
                    borderBottom: index === scammers.length - 1 ? 'none' : '1px solid #333',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(60, 60, 60, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{
                    padding: '15px 20px',
                    color: '#f0f0f0',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }}>{scammer.discord_id}</td>
                  <td style={{
                    padding: '15px 20px',
                    color: '#f0f0f0'
                  }}>{scammer.discord_name}</td>
                  <td style={{
                    padding: '15px 20px',
                    color: '#f0f0f0'
                  }}>{scammer.scam_method}</td>
                  <td style={{
                    padding: '15px 20px',
                    color: '#f0f0f0'
                  }}>{formatDate(scammer.created_at)}</td>
                  <td style={{
                    padding: '15px 20px'
                  }}>
                    <span style={getStatusBadge(scammer.status)}>
                      {scammer.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  {showActions && (
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => onViewDetails(scammer)}
                          style={{
                            background: 'rgba(60, 60, 60, 0.8)',
                            border: '1px solid #444',
                            color: '#ddd',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(100, 100, 100, 0.8)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(60, 60, 60, 0.8)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.color = '#ddd';
                          }}
                        >
                          <i className="fas fa-eye" style={{ fontSize: '0.85rem' }}></i>
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(scammer)}
                            style={{
                              background: 'rgba(60, 60, 60, 0.8)',
                              border: '1px solid #444',
                              color: '#ddd',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(100, 100, 100, 0.8)';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(60, 60, 60, 0.8)';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.color = '#ddd';
                            }}
                          >
                            <i className="fas fa-edit" style={{ fontSize: '0.85rem' }}></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(scammer)}
                            style={{
                              background: 'rgba(60, 60, 60, 0.8)',
                              border: '1px solid #444',
                              color: '#ddd',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(200, 100, 100, 0.8)';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(60, 60, 60, 0.8)';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.color = '#ddd';
                            }}
                          >
                            <i className="fas fa-trash" style={{ fontSize: '0.85rem' }}></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScammerTable;