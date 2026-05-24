import "./Home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="overlay">
          <p className="hero-tag">🚀 Connecting Innovators & Investors</p>
          <h1 className="hero-title">
            Turn Your Startup Vision Into Reality
          </h1>
          <p className="hero-subtitle">
            PITCHNEST is the platform where entrepreneurs pitch their ideas
            and investors discover the next big opportunity.
            <br />
            Join us and be part of the future of business.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-green">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-dark">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Why Choose PITCHNEST?</h2>
        <p className="features-subtitle">Everything you need to connect, pitch, and grow</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Pitch Your Idea</h3>
            <p>Create a compelling startup profile and pitch your idea to thousands of verified investors.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Find Investors</h3>
            <p>Browse through a curated list of investors looking for the next big opportunity.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Grow Together</h3>
            <p>Connect, collaborate, and scale your startup with the right partners by your side.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Trusted</h3>
            <p>Your data and pitches are protected with enterprise-grade security at all times.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Find Your Perfect Match?</h2>
        <p>Join thousands of entrepreneurs and investors already on PITCHNEST</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-green">
            Join as Entrepreneur
          </Link>
          <Link to="/register" className="btn btn-dark">
            Join as Investor
          </Link>
        </div>
      </section>
    </>
  );
};