import React from 'react';
import Modal from './Modal';

const ScammerDetailModal = ({ isOpen, onClose, scammer }) => {
  if (!scammer) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold border";
    if (status === 'active') {
      return `${baseClasses} bg-red-500/20 text-red-400 border-red-500/50`;
    } else {
      return `${baseClasses} bg-green-500/20 text-green-400 border-green-500/50`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Подробная информация о мошеннике">
      <div className="space-y-4">
        <div>
          <strong className="text-gray-400 inline-block w-36">ID Discord:</strong>
          <span className="text-gray-200 font-mono">{scammer.discord_id}</span>
        </div>
        
        <div>
          <strong className="text-gray-400 inline-block w-36">Ник Discord:</strong>
          <span className="text-gray-200">{scammer.discord_name}</span>
        </div>
        
        <div>
          <strong className="text-gray-400 inline-block w-36">Метод обмана:</strong>
          <span className="text-gray-200">{scammer.scam_method}</span>
        </div>
        
        <div>
          <strong className="text-gray-400 inline-block w-36">Дата добавления:</strong>
          <span className="text-gray-200">{formatDate(scammer.created_at)}</span>
        </div>
        
        <div>
          <strong className="text-gray-400 inline-block w-36">Статус:</strong>
          <span className={getStatusBadge(scammer.status)}>
            {scammer.status === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        </div>
        
        <div>
          <strong className="text-gray-400 block mb-2">Описание:</strong>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-gray-200 leading-relaxed">
            {scammer.description}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ScammerDetailModal;