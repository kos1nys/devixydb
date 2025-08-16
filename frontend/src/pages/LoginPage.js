import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const formContainerStyle = {
    background: 'rgba(25, 25, 25, 0.9)',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    border: '1px solid #333',
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

  const buttonStyle = {
    width: '100%',
    padding: '15px 25px',
    background: 'linear-gradient(to right, #333, #555)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    opacity: loading ? 0.7 : 1
  };

  return (
    <Layout>
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <div style={formContainerStyle}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '10px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              }}>
                <i className="fas fa-shield-alt mr-3" style={{ color: '#aaa' }}></i>
                Панель управления
              </h1>
              <p style={{ color: '#aaa', margin: 0 }}>Безопасный вход для администраторов</p>
            </div>

            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(200, 0, 0, 0.2)',
                border: '1px solid #ff6b6b',
                borderRadius: '5px',
                color: '#ff6b6b',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#ccc'
                }}>
                  Логин
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  placeholder="Введите логин"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#666';
                    e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#ccc'
                }}>
                  Пароль
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  placeholder="Введите пароль"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#666';
                    e.target.style.boxShadow = '0 0 8px rgba(100, 100, 100, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
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
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Вход...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Войти в систему
                  </span>
                )}
              </button>
            </form>

            <div style={{
              marginTop: '25px',
              padding: '15px',
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid #333',
              borderRadius: '5px'
            }}>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#ccc',
                marginBottom: '10px',
                margin: '0 0 10px 0'
              }}>
                🔐 Администраторский доступ:
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: '#ccc' }}>Логин:</strong> <code style={{ 
                    background: '#1a1a1a', 
                    padding: '2px 6px', 
                    borderRadius: '3px',
                    fontFamily: 'monospace'
                  }}>cyber_admin_2025</code>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: '#ccc' }}>Пароль:</strong> <code style={{ 
                    background: '#1a1a1a', 
                    padding: '2px 6px', 
                    borderRadius: '3px',
                    fontFamily: 'monospace'
                  }}>Sc4mm3r_Db@Pr0t3ct!</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;