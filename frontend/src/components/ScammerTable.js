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
      return `${baseClasses} bg-red-50 text-red-600 border-red-200`;
    } else {
      return `${baseClasses} bg-green-50 text-green-600 border-green-200`;
    }
  };

  return (
    <div className="bg-white/80 border border-gray-200 rounded-lg overflow-hidden backdrop-blur-sm mb-8 shadow-sm">
      <div className="flex justify-between items-center p-6 bg-white/90 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">
          <i className="fas fa-database mr-2"></i>
          Список мошенников
        </h2>
        <div className="text-gray-500">
          Записей: <span className="text-gray-800 font-medium">{scammers.length}</span>
        </div>
      </div>

      {scammers.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <i className="fas fa-search text-4xl mb-4"></i>
          <p className="text-lg">Мошенники не найдены</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-semibold text-gray-600">ID Discord</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Ник Discord</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Метод обмана</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Дата добавления</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Статус</th>
                {showActions && <th className="px-6 py-4 text-left font-semibold text-gray-600">Действия</th>}
              </tr>
            </thead>
            <tbody>
              {scammers.map((scammer, index) => (
                <tr 
                  key={scammer.id} 
                  className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700 font-mono text-sm">{scammer.discord_id}</td>
                  <td className="px-6 py-4 text-gray-700">{scammer.discord_name}</td>
                  <td className="px-6 py-4 text-gray-600">{scammer.scam_method}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(scammer.created_at)}</td>
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
                          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all"
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(scammer)}
                            className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all"
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(scammer)}
                            className="w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 border border-red-300 flex items-center justify-center text-red-600 hover:text-red-800 transition-all"
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