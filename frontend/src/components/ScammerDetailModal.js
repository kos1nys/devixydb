import React from 'react';
import Modal from './Modal';

const ScammerDetailModal = ({ isOpen, onClose, scammer }) => {
  if (!scammer) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} title="Подробная информация о мошеннике">
      <div>
        <div style={{
          marginBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'inline-block',
            width: '150px'
          }}>ID Discord:</strong>
          <span style={{ 
            color: '#f0f0f0',
            fontFamily: 'monospace'
          }}>{scammer.discord_id}</span>
        </div>
        
        <div style={{
          marginBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'inline-block',
            width: '150px'
          }}>Ник Discord:</strong>
          <span style={{ color: '#f0f0f0' }}>{scammer.discord_name}</span>
        </div>
        
        <div style={{
          marginBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'inline-block',
            width: '150px'
          }}>Метод обмана:</strong>
          <span style={{ color: '#f0f0f0' }}>{scammer.scam_method}</span>
        </div>
        
        <div style={{
          marginBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'inline-block',
            width: '150px'
          }}>Дата добавления:</strong>
          <span style={{ color: '#f0f0f0' }}>{formatDate(scammer.created_at)}</span>
        </div>
        
        <div style={{
          marginBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'inline-block',
            width: '150px'
          }}>Статус:</strong>
          <span style={getStatusBadge(scammer.status)}>
            {scammer.status === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        </div>
        
        <div style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <strong style={{
            color: '#aaa',
            display: 'block',
            marginBottom: '10px'
          }}>Описание:</strong>
          <div style={{
            background: 'rgba(30, 30, 30, 0.8)',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '10px',
            border: '1px solid #333',
            color: '#f0f0f0',
            lineHeight: '1.6'
          }}>
            {scammer.description}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ScammerDetailModal;