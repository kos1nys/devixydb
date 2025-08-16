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

      <footer style={{
        textAlign: 'center',
        padding: '30px 0',
        color: '#777',
        fontSize: '0.9rem',
        borderTop: '1px solid #333',
        marginTop: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <p style={{ marginBottom: '8px', margin: '0 0 8px 0' }}>© 2025 База данных мошенников. Все права защищены.</p>
        <p style={{ margin: 0 }}>Информация предоставляется исключительно в целях предупреждения и защиты пользователей.</p>
      </footer>
    </Layout>
  );
};

export default HomePage;