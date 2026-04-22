import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Loader2 } from 'lucide-react';

// Lazy load all secondary pages — each becomes its own JS chunk
const AboutPage       = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const StorePage       = lazy(() => import('./pages/StorePage').then(m => ({ default: m.StorePage })));
const ProductDetails  = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const AdminPage       = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const ProfilePage     = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PrivacyPolicyPage   = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage  = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const DisclaimerPage      = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));

const PageLoader = () => (
  <div className="h-[60vh] flex items-center justify-center">
    <Loader2 className="animate-spin text-blue-600" size={36} />
  </div>
);

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"           element={<HomePage />} />
                <Route path="/about"      element={<AboutPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/admin"      element={<AdminPage />} />
                <Route path="/profile"    element={<ProfilePage />} />
                <Route path="/privacy"    element={<PrivacyPolicyPage />} />
                <Route path="/terms"      element={<TermsOfServicePage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
