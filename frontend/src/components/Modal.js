import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      display: 'block',
      position: 'fixed',
      zIndex: 1000,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    }}>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        onClick={onClose}
      ></div>
      
      <div style={{
        background: '#1a1a1a',
        margin: '5% auto',
        padding: '30px',
        border: '1px solid #333',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '700px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <button
          onClick={onClose}
          style={{
            color: '#aaa',
            float: 'right',
            fontSize: '28px',
            fontWeight: 'bold',
            cursor: 'pointer',
            position: 'absolute',
            right: '20px',
            top: '15px',
            background: 'none',
            border: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#aaa';
          }}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <h2 style={{
          marginBottom: '20px',
          color: '#ddd',
          borderBottom: '1px solid #333',
          paddingBottom: '15px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>{title}</h2>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;