import React, { useState, useEffect } from 'react';
import './Articles.css'; // Import your CSS file

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      (article.name && article.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="articles-container">
      <div className="mb-6">
        <h1 className="articles-header">Articles</h1>
        
        {/* Search and Filter Section */}
        <div className="search-filter-row">
          <input
            type="text"
            placeholder="Search by name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Articles List */}
        <div className="articles-grid">
          {filteredArticles.length === 0 ? (
            <div className="empty-state">
              No articles found.
            </div>
          ) : (
            filteredArticles.map(article => (
              <div key={article.id || article._id} className="article-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="article-title">{article.name}</span>
                  <span className="article-type">{article.type}</span>
                </div>
                <p><span className="article-label">Category:</span> {article.category}</p>
                {article.nationality && (
                  <p><span className="article-label">Nationality:</span> {article.nationality}</p>
                )}
                {article.year && (
                  <p><span className="article-label">Year:</span> {article.year}</p>
                )}
                {article.notable_work && (
                  <p><span className="article-label">Notable Work:</span> {article.notable_work}</p>
                )}
                <p className="article-about">{article.about}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;