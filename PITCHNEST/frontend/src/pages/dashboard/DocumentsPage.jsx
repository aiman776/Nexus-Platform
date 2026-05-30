import { useState } from 'react';
import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './DocumentsPage.css';

const initialDocuments = [
  {
    id: 1,
    name: 'Pitch Deck 2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    shared: true
  },
  {
    id: 2,
    name: 'Financial Projections.xlsx',
    type: 'Spreadsheet',
    size: '1.8 MB',
    lastModified: '2024-02-10',
    shared: false
  },
  {
    id: 3,
    name: 'Business Plan.docx',
    type: 'Document',
    size: '3.2 MB',
    lastModified: '2024-02-05',
    shared: true
  },
  {
    id: 4,
    name: 'Market Research.pdf',
    type: 'PDF',
    size: '5.1 MB',
    lastModified: '2024-01-28',
    shared: false
  }
];

const DocumentsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [documents, setDocuments] = useState(initialDocuments);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleShare = (id) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, shared: !doc.shared } : doc
    ));
  };

  const filteredDocs = documents.filter(doc => {
    if (activeFilter === 'shared') return doc.shared;
    return true;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Documents</h1>
            <p>Manage your startup's important files</p>
          </div>
          <button className="dashboard-btn">
            <Upload size={18} /> Upload Document
          </button>
        </div>

        <div className="docs-layout">

          {/* Left - Storage */}
          <div className="docs-sidebar-card">
            <h2>Storage</h2>

            <div className="storage-info">
              <div className="storage-row">
                <span>Used</span>
                <span>12.5 GB</span>
              </div>
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: '65%' }} />
              </div>
              <div className="storage-row">
                <span>Available</span>
                <span>7.5 GB</span>
              </div>
            </div>

            <div className="quick-access">
              <h3>Quick Access</h3>
              {[
                { label: 'All Files', value: 'all' },
                { label: 'Shared with Me', value: 'shared' },
                { label: 'Recent Files', value: 'recent' },
                { label: 'Starred', value: 'starred' },
                { label: 'Trash', value: 'trash' },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`quick-btn ${activeFilter === item.value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Document List */}
          <div className="docs-main-card">
            <div className="docs-card-header">
              <h2>All Documents</h2>
              <div className="docs-actions">
                <button className="doc-filter-btn">Sort by</button>
                <button className="doc-filter-btn">Filter</button>
              </div>
            </div>

            <div className="doc-list">
              {filteredDocs.length === 0 ? (
                <div className="empty-state">
                  <p>No documents found</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div className="doc-item" key={doc.id}>
                    <div className="doc-icon">
                      <FileText size={24} />
                    </div>

                    <div className="doc-info">
                      <div className="doc-name-row">
                        <h3>{doc.name}</h3>
                        {doc.shared && (
                          <span className="badge-shared">Shared</span>
                        )}
                      </div>
                      <div className="doc-meta">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                      </div>
                    </div>

                    <div className="doc-btns">
                      <button className="doc-icon-btn" title="Download">
                        <Download size={18} />
                      </button>
                      <button
                        className="doc-icon-btn"
                        title="Share"
                        onClick={() => handleShare(doc.id)}
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        className="doc-icon-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;