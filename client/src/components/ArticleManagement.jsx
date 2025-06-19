import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArticleManagement.css'; // Import your CSS file

const ArticleManagement = ({ userRole }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    name: '',
    born: '',
    died: '',
    nationality: '',
    known_for: '',
    notable_work: '',
    about: '',
    year: '',
    medium: '',
    dimensions: '',
    location: '',
    designed_by: '',
    developer: '',
    category: '',
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://localhost:3000/articles`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      const data = await response.json();
      setArticles(Array.isArray(data) ? data : []);
      const uniqueCategories = Array.from(new Set((Array.isArray(data) ? data : []).map(article => article.category).filter(Boolean)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedArticle) {
        await axios.put(`http://localhost:3000/articles/${selectedArticle._id}`, formData,
          {
            headers: {
              'Authorization': `${token}`
            }
          }
        );
      } else {
        await axios.post(`http://localhost:3000/articles/`, formData,
          {
            headers: {
              'Authorization': `${token}`
            }
          }
        )
      }
      fetchArticles();
      resetForm();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleDelete = async (articleId) => {
    if (userRole !== 'admin') return;
    
    try {
      await axios.delete(`http://localhost:3000/articles/${articleId}`,
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      name: article.name || '',
      born: article.born || '',
      died: article.died || '',
      nationality: article.nationality || '',
      known_for: article.known_for || '',
      notable_work: article.notable_work || '',
      about: article.about || '',
      year: article.year || '',
      medium: article.medium || '',
      dimensions: article.dimensions || '',
      location: article.location || '',
      designed_by: article.designed_by || '',
      developer: article.developer || '',
      category: article.category || '',
    });
  };

  const resetForm = () => {
    setSelectedArticle(null);
    setFormData({
      name: '',
      born: '',
      died: '',
      nationality: '',
      known_for: '',
      notable_work: '',
      about: '',
      year: '',
      medium: '',
      dimensions: '',
      location: '',
      designed_by: '',
      developer: '',
      category: '',
    });
  };

  return (
    <div className="article-mgmt-container">
      <h1 className="article-mgmt-header">Article Management</h1>

      {/* Article Form */}
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Born</label>
            <input
              type="text"
              className="form-input"
              value={formData.born}
              onChange={(e) => setFormData({ ...formData, born: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Died</label>
            <input
              type="text"
              className="form-input"
              value={formData.died}
              onChange={(e) => setFormData({ ...formData, died: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <input
              type="text"
              className="form-input"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Known For</label>
            <input
              type="text"
              className="form-input"
              value={formData.known_for}
              onChange={(e) => setFormData({ ...formData, known_for: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notable Work</label>
            <input
              type="text"
              className="form-input"
              value={formData.notable_work}
              onChange={(e) => setFormData({ ...formData, notable_work: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">About</label>
            <textarea
              className="form-textarea"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="text"
              className="form-input"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Medium</label>
            <input
              type="text"
              className="form-input"
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dimensions</label>
            <input
              type="text"
              className="form-input"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Designed By</label>
            <input
              type="text"
              className="form-input"
              value={formData.designed_by}
              onChange={(e) => setFormData({ ...formData, designed_by: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Developer</label>
            <input
              type="text"
              className="form-input"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedArticle ? 'Update Article' : 'Add Article'}
          </button>
          {selectedArticle && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Articles List */}
      <div className="article-list">
        {articles.map(article => (
          <div key={article.id || article._id} className="article-item">
            <div className="article-details">
              <h2>{article.name}</h2>
              <p><span className="article-label">Category:</span> {article.category}</p>
              <p><span className="article-label">Born:</span> {article.born} <span className="article-label">Died:</span> {article.died}</p>
              <p><span className="article-label">Nationality:</span> {article.nationality}</p>
              <p><span className="article-label">Known For:</span> {article.known_for}</p>
              <p><span className="article-label">Notable Work:</span> {article.notable_work}</p>
              <p><span className="article-label">About:</span> {article.about}</p>
              <p><span className="article-label">Year:</span> {article.year}</p>
              <p><span className="article-label">Medium:</span> {article.medium}</p>
              <p><span className="article-label">Dimensions:</span> {article.dimensions}</p>
              <p><span className="article-label">Location:</span> {article.location}</p>
              <p><span className="article-label">Designed By:</span> {article.designed_by}</p>
              <p><span className="article-label">Developer:</span> {article.developer}</p>
            </div>
            <div className="article-actions">
              <button onClick={() => handleEdit(article)} className="btn btn-warning">
                Edit
              </button>
              {userRole === 'admin' && (
                <button onClick={() => handleDelete(article.id || article._id)} className="btn btn-danger">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleManagement;