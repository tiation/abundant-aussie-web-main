import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">RiggerConnect Dashboard</h1>
        <p className="text-blue-100">Professional Rigging Network</p>
      </header>
      
      <main className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Near You</h3>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </div>
        </div>

        {/* Recent Jobs */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Recent Jobs</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((job) => (
              <div key={job} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-900">Senior Rigger - Mining Project</h3>
                <p className="text-sm text-gray-600 mt-1">Perth, WA • $75-95/hour • FIFO</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    New
                  </span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
