import '../../style/Footer.css';

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import saralBuyLogo from '/footer-logo.png';
const Footer = () => {
  return (
    <footer className=" footer-container">
      <div className="footer-content">
        {/* Logo & Description */}
        <div className="footer-section">
          <Link to={'/'} className="flex items-center gap-2">
            <img
              src={saralBuyLogo}
              className="max-h-20  dark:invert mix-blend-light"
              alt={'company logo'}
            />
          </Link>
          <p className="footer-description">
            SaralBuy is Karnataka's leading B2B bulk procurement platform. We connect verified buyers and industrial suppliers directly, bringing transparent reverse-bidding and 0% commission to bulk trade.
          </p>
        </div>

        {/* Category */}
        <div className="footer-section">
          <h4 className="footer-title">Category</h4>
          <ul>
            <li>Building Materials</li>
            <li>Electrical & Lighting</li>
            <li>Plumbing & Sanitation</li>
            <li>Steel & Structural</li>
            <li>Finishing & Tiles</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4 className="footer-title">Support</h4>
          <ul>
            <li>Help & Support</li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li>Help</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt /> Peenya Industrial Area, Bengaluru, Karnataka, India
            </li>
            <li>
              <FaEnvelope /> support@saralbuy.com
            </li>
            <li>
              <FaPhone /> +91 98765 43210
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-socials">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaPinterestP />
          <FaYoutube />
        </div>

        <p>Copyright@saralbuy2025</p>
        <div className="footer-payments">
          <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" />
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
