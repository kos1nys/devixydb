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
      newErrors.scam_method = 'Выберите метод обмана';
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

  const scamMethods = [
    'Фишинг',
    'Вымогательство',
    'Мошенничество с криптой',
    'Поддельные раздачи',
    'Продажа несуществующих услуг',
    'Другое'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ID Discord *
          </label>
          <input
            type="text"
            value={formData.discord_id}
            onChange={(e) => handleChange('discord_id', e.target.value)}
            placeholder="123456789012345678"
            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.discord_id 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500/50'
            }`}
          />
          {errors.discord_id && (
            <p className="text-red-400 text-sm mt-1">{errors.discord_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ник Discord *
          </label>
          <input
            type="text"
            value={formData.discord_name}
            onChange={(e) => handleChange('discord_name', e.target.value)}
            placeholder="Scammer#1234"
            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.discord_name 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500/50'
            }`}
          />
          {errors.discord_name && (
            <p className="text-red-400 text-sm mt-1">{errors.discord_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Метод обмана *
          </label>
          <select
            value={formData.scam_method}
            onChange={(e) => handleChange('scam_method', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.scam_method 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500/50'
            }`}
          >
            <option value="">Выберите метод</option>
            {scamMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          {errors.scam_method && (
            <p className="text-red-400 text-sm mt-1">{errors.scam_method}</p>
          )}
        </div>

        {scammer && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:border-gray-500 focus:ring-gray-500/50 transition-colors"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Описание *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Подробное описание действий мошенника..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors resize-vertical ${
              errors.description 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500/50'
            }`}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:from-gray-800 disabled:to-gray-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Сохранение...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-save mr-2"></i>
                {scammer ? 'Сохранить изменения' : 'Добавить в базу'}
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all"
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScammerForm;