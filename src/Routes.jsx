import Dashboard from '@/pages/Dashboard';
import { Suspense, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
// import ScrollToTop from '@/utils/ScrollToTop'
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
      {/* <ScrollToTop /> */}
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
          <Route path="/product-listing" element={<ProductListing />} />
          <Route path="/product-overview" element={<ProductOverview />} />
          <Route path="*" element={<h1>No Route Found</h1>} />

          {/*  account */}
          <Route path="/account" element={<Profile />}>
            <Route index element={<AccountSettings />} />
            <Route path="cart" element={<Cart />} />
            <Route path="bid" element={<BidListing />} />
            {/* <Route path="deal" element={<Deal />} />
            <Route path="requirements" element={<BidRequirements />} />
            <Route
              path="requirements/:requirementId"
              element={<RequirementOverview />}
            /> */}
            {/* <Route path="notification" element={<Notification />} /> */}
          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
