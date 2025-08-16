import React from 'react';

const ScammerTable = ({ 
  scammers, 
  onViewDetails, 
  onEdit = null, 
  onDelete = null, 
  showActions = true 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold border";
    if (status === 'active') {
      return `${baseClasses} bg-red-500/20 text-red-400 border-red-500/50`;
    } else {
      return `${baseClasses} bg-green-500/20 text-green-400 border-green-500/50`;
    }
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm mb-8">
      <div className="flex justify-between items-center p-6 bg-gray-800/80 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200">
          <i className="fas fa-database mr-2"></i>
          Список мошенников
        </h2>
        <div className="text-gray-400">
          Записей: <span className="text-white font-medium">{scammers.length}</span>
        </div>
      </div>

      {scammers.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <i className="fas fa-search text-4xl mb-4"></i>
          <p className="text-lg">Мошенники не найдены</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/80 border-b border-gray-600">
                <th className="px-6 py-4 text-left font-semibold text-gray-300">ID Discord</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-300">Ник Discord</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-300">Метод обмана</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-300">Дата добавления</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-300">Статус</th>
                {showActions && <th className="px-6 py-4 text-left font-semibold text-gray-300">Действия</th>}
              </tr>
            </thead>
            <tbody>
              {scammers.map((scammer, index) => (
                <tr 
                  key={scammer.id} 
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-200 font-mono text-sm">{scammer.discord_id}</td>
                  <td className="px-6 py-4 text-gray-200">{scammer.discord_name}</td>
                  <td className="px-6 py-4 text-gray-300">{scammer.scam_method}</td>
                  <td className="px-6 py-4 text-gray-300">{formatDate(scammer.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(scammer.status)}>
                      {scammer.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewDetails(scammer)}
                          className="w-9 h-9 rounded-full bg-gray-600 hover:bg-gray-500 border border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(scammer)}
                            className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(scammer)}
                            className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 border border-red-500 flex items-center justify-center text-white transition-all"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScammerTable;