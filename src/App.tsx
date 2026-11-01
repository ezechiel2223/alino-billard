import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import Promotions from './pages/Promotions';
import Formation from './pages/Formation';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminProducts from './pages/AdminProducts';
import AdminPromotions from './pages/AdminPromotions';
import AdminVertical from './pages/AdminVertical';
import AdminTraining from './pages/AdminTraining';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/produits" element={<Products />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/formation" element={<Formation />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/promotions" element={<AdminPromotions />} />
        <Route path="/admin/vertical" element={<AdminVertical />} />
        <Route path="/admin/training" element={<AdminTraining />} />
      </Route>
    </Routes>
  );
}

