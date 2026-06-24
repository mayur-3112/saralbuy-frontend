import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';
import HomeNavbar from './components/custom/dashboard/HomeNavbar';
import Footer from './components/custom/Footer';
const Requirement = lazy(() => import('./components/custom/dashboard/Requirement'));
import Authentication from './components/custom/auth/Authenticate';
import CreateProductForm from './pages/CreateProductForm';
import ProductListing from './pages/ProductListing';
import ProductOverview from './pages/ProductOverview';
import Profile from './pages/profile/Profile';
import { AccountSettings } from './pages/profile/AccountSetting';
import BidListing from './pages/profile/BidListing';
import BidOverview from './pages/profile/BidOverView';
import Requirements from './pages/profile/Requirements';
import CloseDeal from './pages/profile/CloseDeal';
import UpdateCreateProductForm from './pages/UpdateCreateProductForm';
import RequirementOverview from './pages/RequirementOverview';
import PostRequirementForm from './pages/PostRequirementForm';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import HowItWorksBuyers from './pages/HowItWorksBuyers';
import HowItWorksSuppliers from './pages/HowItWorksSuppliers';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NoRouteFound from './pages/404';
import Loader from './components/custom/Loader';
import Notification from './pages/Notification';
import UserProfile from './pages/UserProfile';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import PolicyConsentPopup from './components/custom/popups/PolicyConsentPopup';
import { useUserState } from './redux/hooks/useUser';
import DiscussionChatbox from './components/custom/dashboard/DiscussionChatbox';
import LandingPage from './components/custom/landing/LandingPage';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const SupplierTools = lazy(() => import('./pages/SupplierTools'));
const BuyerTools = lazy(() => import('./pages/BuyerTools'));

const ProtectRoute = () => {
  const { user } = useUserState();
  if (!user) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

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
      <PolicyConsentPopup />
      <DiscussionChatbox />
      <HomeNavbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/requirement" element={<Requirement />} />
          <Route path="/post-requirement" element={<PostRequirementForm />} />
          <Route path="/category/:categoryId/:subCategoryId" element={<CreateProductForm />} />
          <Route path="/update-draft/:productId" element={<UpdateCreateProductForm />} />
          <Route path="/product-listing" element={<ProductListing />} />
          <Route path="/product-overview" element={<ProductOverview />} />
          <Route path="/terms" element={<TermsAndPrivacy />} />
          <Route path="/privacy" element={<TermsAndPrivacy />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/how-it-works/buyers" element={<HowItWorksBuyers />} />
          <Route path="/how-it-works/suppliers" element={<HowItWorksSuppliers />} />
          <Route path="/supplier-tools" element={<SupplierTools />} />
          <Route path="/buyer-tools" element={<BuyerTools />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          {/*  account */}
          <Route path="/account" element={<Profile />}>
            <Route index element={<AccountSettings />} />
            <Route path="bid" element={<BidListing />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="deal" element={<CloseDeal />} />
            <Route path="notification" element={<Notification />} />
            <Route path="requirements-overview/:requirementId" element={<RequirementOverview />} />
          </Route>
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route element={<ProtectRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bid-overview/:bidId" element={<BidOverview />} />
          </Route>
          <Route path="*" element={<NoRouteFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
