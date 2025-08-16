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
      <div className="flex items-center justify-between mb-8 p-6 bg-gray-800/60 border border-gray-700 rounded-lg backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white">
            <i className="fas fa-cog mr-3 text-gray-400"></i>
            Панель управления
          </h1>
          <p className="text-gray-400 mt-1">Добро пожаловать, {user?.username}!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-plus mr-2"></i>
            Добавить мошенника
          </button>
          <button
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <p className="text-gray-400 mt-4">Загрузка данных...</p>
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