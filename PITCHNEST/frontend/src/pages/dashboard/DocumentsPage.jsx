import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [documents, setDocuments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Documents fetch karo
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/documents/my-documents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDocuments(data.documents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDocuments();
  }, [token]);

  // ✅ Upload document
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('http://localhost:1000/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments(prev => [data.document, ...prev]);
        alert('Document uploaded successfully!');
      } else {
        alert(data.msg || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete document
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:1000/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDocuments(documents.filter(doc => doc._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Toggle share
  const handleShare = async (id) => {
    try {
      const res = await fetch(`http://localhost:1000/api/documents/share/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments(documents.map(doc =>
          doc._id === id ? { ...doc, shared: data.document.shared } : doc
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Download document
  const handleDownload = (id, name) => {
    window.open(`http://localhost:1000/api/documents/download/${id}`, '_blank');
  };

  const filteredDocs = documents.filter(doc => {
    if (activeFilter === 'shared') return doc.shared;
    return true;
  });

  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size) || 0;
    return acc + size;
  }, 0).toFixed(1);

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Documents</h1>
            <p>Manage your startup's important files</p>
          </div>
          <button
            className="dashboard-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx"
          />
        </div>

        <div className="docs-layout">
          <div className="docs-sidebar-card">
            <h2>Storage</h2>
            <div className="storage-info">
              <div className="storage-row">
                <span>Used</span>
                <span>{totalSize} MB</span>
              </div>
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: `${Math.min((totalSize / 100) * 100, 100)}%` }} />
              </div>
              <div className="storage-row">
                <span>Total Files</span>
                <span>{documents.length}</span>
              </div>
            </div>

            <div className="quick-access">
              <h3>Quick Access</h3>
              {[
                { label: 'All Files', value: 'all' },
                { label: 'Shared', value: 'shared' },
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

          <div className="docs-main-card">
            <div className="docs-card-header">
              <h2>All Documents</h2>
            </div>

            <div className="doc-list">
              {loading ? (
                <p>Loading...</p>
              ) : filteredDocs.length === 0 ? (
                <div className="empty-state">
                  <p>No documents found</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div className="doc-item" key={doc._id}>
                    <div className="doc-icon">
                      <FileText size={24} />
                    </div>
                    <div className="doc-info">
                      <div className="doc-name-row">
                        <h3>{doc.name}</h3>
                        {doc.shared && <span className="badge-shared">Shared</span>}
                      </div>
                      <div className="doc-meta">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="doc-btns">
                      <button
                        className="doc-icon-btn"
                        title="Download"
                        onClick={() => handleDownload(doc._id, doc.name)}
                      >
                        <Download size={18} />
                      </button>
                      <button
                        className="doc-icon-btn"
                        title="Share"
                        onClick={() => handleShare(doc._id)}
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        className="doc-icon-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(doc._id)}
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