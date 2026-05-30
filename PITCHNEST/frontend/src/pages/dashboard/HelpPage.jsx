import { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './HelpPage.css';

const entrepreneurFaqs = [
  {
    question: 'How do I connect with investors?',
    answer: 'You can browse our investor directory and send connection requests...'
  },
  {
    question: 'What should I include in my startup profile?',
    answer: 'Your startup profile should include a compelling pitch, funding needs...'
  },
  {
    question: 'How do I share documents securely?',
    answer: 'You can upload documents to your secure document vault...'
  },
  {
    question: 'What are collaboration requests?',
    answer: 'Collaboration requests are formal expressions of interest from investors...'
  }
];

const investorFaqs = [
  {
    question: 'How do I find promising startups?',
    answer: 'Browse our startup directory and filter by industry, stage, and location to find startups that match your investment criteria.'
  },
  {
    question: 'How do I send a collaboration request?',
    answer: 'Visit a startup profile and click the Connect button to send a collaboration request. The entrepreneur will be notified immediately.'
  },
  {
    question: 'How do I manage my portfolio?',
    answer: 'Your portfolio section shows all your investments and connections. You can track progress and communicate with entrepreneurs from there.'
  },
  {
    question: 'How are deals structured on PITCHNEST?',
    answer: 'PITCHNEST facilitates introductions and connections. The actual deal terms are negotiated directly between investors and entrepreneurs.'
  }
];

const HelpPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';
  // ✅ Yeh line add karo
  const faqs = role === 'investor' ? investorFaqs : entrepreneurFaqs;
 
  // ✅ formData mein email auto-fill
  const [formData, setFormData] = useState({
     username: user?.username || "", // ✅ login username auto fill
     email: user?.email || "", // ✅ login email auto fill
    message: "",
  });

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1000/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ username: "", email: "", message: "" });
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Server error!");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="help-header">
          <h1>Help & Support</h1>
          <p>Find answers to common questions or get in touch with our support team</p>
        </div>

        {/* Search */}
        <div className="help-search">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search help articles..." />
          </div>
        </div>

        {/* Quick Links */}
        <div className="help-cards">
          <div className="help-card">
            <div className="help-card-icon blue">
              <Book size={24} />
            </div>
            <h2>Documentation</h2>
            <p>Browse our detailed documentation and guides</p>
            <button className="help-btn outline">
              View Docs <ExternalLink size={14} />
            </button>
          </div>

          <div className="help-card">
            <div className="help-card-icon blue">
              <MessageCircle size={24} />
            </div>
            <h2>Live Chat</h2>
            <p>Chat with our support team in real-time</p>
            <button className="help-btn primary">
              Start Chat
            </button>
          </div>

          <div className="help-card">
            <div className="help-card-icon blue">
              <Phone size={24} />
            </div>
            <h2>Contact Us</h2>
            <p>Get help via email or phone</p>
            <button className="help-btn outline">
              <Mail size={14} /> Contact Support
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="help-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="help-section">
          <h2>Still need help?</h2>
          <form className="help-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
          
<input
  type="text"
  name="username"
  value={formData.username}
  onChange={handleFormInput}
  placeholder="Your name"
  readOnly // ✅ username field readonly
  className="input-readonly"
  required
/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleFormInput}
    placeholder="your@email.com"
    readOnly  // ✅ change na kar sakay
    className="input-readonly"
    required
  />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormInput}
                rows={4}
                placeholder="How can we help you?"
                required
              />
            </div>
            <button type="submit" className="help-btn primary">
              Send Message
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default HelpPage;