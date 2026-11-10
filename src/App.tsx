import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage.tsx'
import Footer from './components/Footer.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import AuthPage from './pages/AuthPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayoutPage from './pages/AdminPage/AdminLayoutPage.tsx';
import AdminPanelPage from './pages/AdminPage/AdminPanelPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { Toaster } from 'react-hot-toast';
import BasketPage from './pages/BasketPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin") || location.pathname === "/admin-panel";
  const isAuthPage = location.pathname === "/auth";
  return (
    <>
        <Toaster position="top-center" />
        <ScrollToTop />
        {isAdminPath || isAuthPage ? null : <Navbar />}
        <div className={`${isAdminPath || isAuthPage ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:servername" element={<ProductDetailsPage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute guestOnly>
                  <AdminLayoutPage /> 
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-panel" 
              element={
                <AdminProtectedRoute>
                  <AdminPanelPage />
                </AdminProtectedRoute>
              } 
            />
          </Routes>
        </div>
        {isAdminPath || isAuthPage ? null : <Footer />}
    </>
  )
}

export default App
