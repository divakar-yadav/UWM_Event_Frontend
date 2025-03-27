import React from 'react';

const Refresh = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleRefresh} className="bg-blue-500 text-white py-2 px-4 rounded">
      Refresh
    </button>
  );
};

export default Refresh;
