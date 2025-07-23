import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Dashboard from './pages/Dashboard';
import JobPosting from './pages/jobs/JobPosting';
import WorkerSearch from './pages/workers/WorkerSearch';
import ComplianceManagement from './pages/compliance/ComplianceManagement';
import RecruitmentProcessing from './pages/recruitment/RecruitmentProcessing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobPosting />} />
          <Route path="workers" element={<WorkerSearch />} />
          <Route path="compliance" element={<ComplianceManagement />} />
          <Route path="recruitment" element={<RecruitmentProcessing />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
