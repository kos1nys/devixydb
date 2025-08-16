import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import ScammerTable from '../components/ScammerTable';
import ScammerDetailModal from '../components/ScammerDetailModal';
import ScammerForm from '../components/ScammerForm';

const AdminDashboard = () => {
  const [scammers, setScammers] = useState([]);
  const [filteredScammers, setFilteredScammers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedScammer, setSelectedScammer] = useState(null);
  const [editingScammer, setEditingScammer] = useState(null);

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load scammers (protected endpoint)
      const scammersResponse = await axios.get(`${API_BASE}/scammers?limit=1000`);
      setScammers(scammersResponse.data);
      setFilteredScammers(scammersResponse.data);
      
      // Load statistics
      const statsResponse = await axios.get(`${API_BASE}/statistics`);
      setStats(statsResponse.data);
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredScammers(scammers);
      return;
    }

    const filtered = scammers.filter(scammer =>
      scammer.discord_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scammer.discord_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredScammers(filtered);
  };

  const handleViewDetails = (scammer) => {
    setSelectedScammer(scammer);
    setDetailModalOpen(true);
  };

  const handleEdit = (scammer) => {
    setEditingScammer(scammer);
    setFormModalOpen(true);
  };

  const handleDelete = async (scammer) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/scammers/${scammer.id}`);
      
      // Remove from local state
      const updatedScammers = scammers.filter(s => s.id !== scammer.id);
      setScammers(updatedScammers);
      setFilteredScammers(updatedScammers.filter(s => 
        !filteredScammers.find(fs => fs.id === scammer.id) || 
        updatedScammers.includes(s)
      ));
      
      // Reload stats
      const statsResponse = await axios.get(`${API_BASE}/statistics`);
      setStats(statsResponse.data);
      
      alert('Мошенник успешно удален!');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении записи');
    }
  };

  const handleCreateScammer = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/scammers`, formData);
      
      // Add to local state
      const newScammer = response.data;
      const updatedScammers = [...scammers, newScammer];
      setScammers(updatedScammers);
      setFilteredScammers(updatedScammers);
      
      // Reload stats
      const statsResponse = await axios.get(`${API_BASE}/statistics`);
      setStats(statsResponse.data);
      
      alert('Мошенник успешно добавлен в базу данных!');
    } catch (error) {
      console.error('Ошибка создания:', error);
      const message = error.response?.data?.detail || 'Ошибка при добавлении записи';
      alert(message);
      throw error; // Re-throw to prevent modal closing
    }
  };

  const handleUpdateScammer = async (formData) => {
    try {
      const response = await axios.put(`${API_BASE}/scammers/${editingScammer.id}`, formData);
      
      // Update in local state
      const updatedScammer = response.data;
      const updatedScammers = scammers.map(s => 
        s.id === editingScammer.id ? updatedScammer : s
      );
      setScammers(updatedScammers);
      setFilteredScammers(updatedScammers.filter(s => 
        !filteredScammers.find(fs => fs.id === s.id) || 
        filteredScammers.find(fs => fs.id === s.id)
      ));
      
      // Reload stats
      const statsResponse = await axios.get(`${API_BASE}/statistics`);
      setStats(statsResponse.data);
      
      alert('Запись успешно обновлена!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      const message = error.response?.data?.detail || 'Ошибка при обновлении записи';
      alert(message);
      throw error; // Re-throw to prevent modal closing
    }
  };

  const openCreateModal = () => {
    setEditingScammer(null);
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingScammer(null);
  };

  return (
    <Layout>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        padding: '25px',
        background: 'rgba(30, 30, 30, 0.8)',
        border: '1px solid #333',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 5px 0'
          }}>
            <i className="fas fa-cog mr-3" style={{ color: '#aaa' }}></i>
            Панель управления
          </h1>
          <p style={{ color: '#aaa', margin: 0 }}>Добро пожаловать, {user?.username}!</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={openCreateModal}
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(to right, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #218838, #1abc9c)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #28a745, #20c997)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-plus mr-2"></i>
            Добавить мошенника
          </button>
          <button
            onClick={logout}
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(to right, #dc3545, #e74c3c)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #c82333, #c0392b)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #dc3545, #e74c3c)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Выйти
          </button>
        </div>
      </div>

      <Header
        title="База данных мошенников"
        subtitle="Управление записями о мошенниках. Добавляйте, редактируйте и удаляйте записи."
        showStats={true}
        stats={stats}
      />

      <SearchBox onSearch={handleSearch} />

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 0',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '2px solid #333',
            borderTop: '2px solid #aaa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#aaa', marginTop: '16px', margin: '16px 0 0 0' }}>Загрузка данных...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <ScammerTable
          scammers={filteredScammers}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      )}

      {/* Modals */}
      <ScammerDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        scammer={selectedScammer}
      />

      <ScammerForm
        isOpen={formModalOpen}
        onClose={closeFormModal}
        onSubmit={editingScammer ? handleUpdateScammer : handleCreateScammer}
        scammer={editingScammer}
        title={editingScammer ? 'Редактировать запись' : 'Добавить мошенника'}
      />
    </Layout>
  );
};

export default AdminDashboard;