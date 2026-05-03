
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router';
import HomeNavbar from './components/custom/dashboard/HomeNavbar';
import Footer from './components/custom/Footer';
import Requirement from './components/custom/dashboard/Requirement';
import Authentication from './components/custom/auth/Authenticate';
import CreateProductForm from './pages/CreateProductForm';
import ProductListing from './pages/ProductListing';
import ProductOverview from './pages/ProductOverview';
import Profile from './pages/profile/Profile';
import { AccountSettings } from './pages/profile/AccountSetting';
import Cart from './pages/profile/Cart';
import BidListing from './pages/profile/BidListing';
import BidOverview from './pages/profile/BidOverview';
import Requirements from './pages/profile/Requirements';
import CloseDeal from './pages/profile/CloseDeal';
import UpdateCreateProductForm from './pages/UpdateCreateProductForm';
import RequirementOverview from './pages/RequirementOverview';
const Dashboard = lazy(()=>import("./pages/Dashboard"))
const Chatbot = lazy(() => import("./pages/Chatbot"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
// const Profile = lazy(() => import("./pages/profile/Profile"));
export default function AppRoutes() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <Authentication open={open} setOpen={setOpen} />
      <HomeNavbar />
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center text-lg">
            <div className="loader"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requirement" element={<Requirement />} />
          <Route path="/category/:categoryId/:subCategoryId" element={<CreateProductForm />} />
          <Route path="/update-draft/:productId" element={<UpdateCreateProductForm />} />
          <Route path="/product-listing" element={<ProductListing />} />
          <Route path="/product-overview" element={<ProductOverview />} />
          {/*  account */}
          <Route path="/account" element={<Profile />}>
            <Route index element={<AccountSettings />} />
            <Route path="cart" element={<Cart />} />
            <Route path="bid" element={<BidListing />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="deal" element={<CloseDeal />} />
            
            <Route
              path="requirements-overview/:requirementId"
              element={<RequirementOverview />}
            />
           
          </Route>
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/bid-overview/:bidId" element={<BidOverview />} />

          <Route path="*" element={<h1>No Route Found</h1>} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
