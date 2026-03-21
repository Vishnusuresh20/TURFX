import { Link } from 'react-router-dom';
import { ShieldCheck, Car, Clock, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge">Premium Sports Facility</span>
            <h1 className="hero-title">
              Book Your Perfect <br />
              <span className="text-gradient">Turf Slot</span> Today
            </h1>
            <p className="hero-subtitle">
              Experience the best artificial grass ground for your next game. 
              Available for football, cricket, and more.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn-primary btn-lg">
                Book Your Slot Now <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="price-tag">
              <span className="price">₹1</span>
              <span className="per-hour">/ hour</span>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
             <div className="hero-glow"></div>
             {/* Using a placeholder gradient/pattern to look like a turf instead of external image for reliability */}
             <div className="turf-mockup">
                <div className="turf-lines">
                  <div className="center-circle"></div>
                  <div className="center-line"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="text-gradient">Us?</span></h2>
            <p>We provide top-notch facilities to make your game memorable.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <Car size={32} />
              </div>
              <h3>Huge Parking Facility</h3>
              <p>Ample and secure parking space available for all players. No hassle finding a spot.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <ShieldCheck size={32} />
              </div>
              <h3>Premium Turf Quality</h3>
              <p>FIFA-approved high-quality artificial grass for injury-free and smooth gameplay.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>Easy Booking</h3>
              <p>Simple and fast online booking system. Check availability in real-time instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container card">
          <div className="cta-content">
            <h2>Ready to <span className="text-gradient">Play?</span></h2>
            <p>Join hundreds of players who have made us their home ground.</p>
          </div>
          <Link to="/login" className="btn-primary">
            Get Started <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
