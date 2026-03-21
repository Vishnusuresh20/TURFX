import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-section">
          <h3>TURF<span className="text-gradient">-X</span></h3>
          <p className="footer-desc">
            Premium turf booking experience. Whether you want to play a quick casual game or host a local tournament, we offer the best facilities in town with easy slot booking.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/book">Book a Slot</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Near Logan's Road, Thalassery, Kerala 670101</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+91 81379 41259</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <a href="mailto:vishnusuresh034@gmail.com">vishnusuresh034@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TURF-X System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
