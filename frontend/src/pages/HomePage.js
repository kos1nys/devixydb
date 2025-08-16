import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import ScammerTable from '../components/ScammerTable';
import ScammerDetailModal from '../components/ScammerDetailModal';

const HomePage = () => {
  const [scammers, setScammers] = useState([]);
  const [filteredScammers, setFilteredScammers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedScammer, setSelectedScammer] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

  // Load scammers and stats
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load scammers (public endpoint)
      const scammersResponse = await axios.get(`${API_BASE}/scammers/public?limit=1000`);
      setScammers(scammersResponse.data);
      setFilteredScammers(scammersResponse.data);
      
      // Load statistics
      const statsResponse = await axios.get(`${API_BASE}/statistics`);
      setStats(statsResponse.data);
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
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

  return (
    <Layout>
      <Header
        title="База данных мошенников"
        subtitle="Система отслеживания и идентификации мошеннических действий. Помогаем защитить пользователей от финансовых потерь."
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
          showActions={true}
          onEdit={null}
          onDelete={null}
        />
      )}

      <ScammerDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        scammer={selectedScammer}
      />

      <footer className="text-center py-8 text-gray-500 border-t border-gray-700 mt-8">
        <p className="mb-2">© 2025 База данных мошенников. Все права защищены.</p>
        <p className="text-sm">Информация предоставляется исключительно в целях предупреждения и защиты пользователей.</p>
      </footer>
    </Layout>
  );
};

export default HomePage;