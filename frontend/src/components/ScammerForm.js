import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const ScammerForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  scammer = null, 
  title = "Добавить мошенника" 
}) => {
  const [formData, setFormData] = useState({
    discord_id: '',
    discord_name: '',
    scam_method: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update form when scammer prop changes (for editing)
  useEffect(() => {
    if (scammer) {
      setFormData({
        discord_id: scammer.discord_id || '',
        discord_name: scammer.discord_name || '',
        scam_method: scammer.scam_method || '',
        description: scammer.description || '',
        status: scammer.status || 'active'
      });
    } else {
      setFormData({
        discord_id: '',
        discord_name: '',
        scam_method: '',
        description: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [scammer, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.discord_id.trim()) {
      newErrors.discord_id = 'ID Discord обязателен';
    } else if (!/^\d{18}$/.test(formData.discord_id)) {
      newErrors.discord_id = 'ID Discord должен состоять из 18 цифр';
    }

    if (!formData.discord_name.trim()) {
      newErrors.discord_name = 'Ник Discord обязателен';
    }

    if (!formData.scam_method) {
      newErrors.scam_method = 'Метод обмана обязателен';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#ccc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '5px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#ff6b6b'
  };

  const buttonStyle = {
    padding: '12px 25px',
    background: 'linear-gradient(to right, #333, #555)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            ID Discord *
          </label>
          <input
            type="text"
            value={formData.discord_id}
            onChange={(e) => handleChange('discord_id', e.target.value)}
            placeholder="123456789012345678"
            style={errors.discord_id ? errorInputStyle : inputStyle}
            onFocus={(e) => {
              if (!errors.discord_id) {
                e.target.style.borderColor = '#666';
                e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
              }
            }}
            onBlur={(e) => {
              if (!errors.discord_id) {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.discord_id && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px', margin: '5px 0 0 0' }}>
              {errors.discord_id}
            </p>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Ник Discord *
          </label>
          <input
            type="text"
            value={formData.discord_name}
            onChange={(e) => handleChange('discord_name', e.target.value)}
            placeholder="Scammer#1234"
            style={errors.discord_name ? errorInputStyle : inputStyle}
            onFocus={(e) => {
              if (!errors.discord_name) {
                e.target.style.borderColor = '#666';
                e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
              }
            }}
            onBlur={(e) => {
              if (!errors.discord_name) {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.discord_name && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px', margin: '5px 0 0 0' }}>
              {errors.discord_name}
            </p>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Метод обмана *
          </label>
          <input
            type="text"
            value={formData.scam_method}
            onChange={(e) => handleChange('scam_method', e.target.value)}
            placeholder="Например: Фишинг, Вымогательство, Мошенничество с криптой..."
            style={errors.scam_method ? errorInputStyle : inputStyle}
            onFocus={(e) => {
              if (!errors.scam_method) {
                e.target.style.borderColor = '#666';
                e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
              }
            }}
            onBlur={(e) => {
              if (!errors.scam_method) {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.scam_method && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px', margin: '5px 0 0 0' }}>
              {errors.scam_method}
            </p>
          )}
        </div>

        {scammer && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#666';
                e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
        )}

        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Описание *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Подробное описание действий мошенника..."
            rows={4}
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical',
              ...(errors.description ? { borderColor: '#ff6b6b' } : {})
            }}
            onFocus={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = '#666';
                e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
              }
            }}
            onBlur={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.description && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px', margin: '5px 0 0 0' }}>
              {errors.description}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', paddingTop: '20px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              flex: '1',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(to right, #444, #666)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(to right, #333, #555)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Сохранение...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {scammer ? 'Сохранить изменения' : 'Добавить в базу'}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(to right, #555, #777)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #666, #888)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #555, #777)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScammerForm;