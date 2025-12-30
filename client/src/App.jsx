import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Stream from './pages/Stream';
import Logs from './pages/Logs';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="stream" element={<Stream />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
