import React, { useState, useEffect } from 'react';
import Articles from '../components/Articles';
import ArticleManagement from '../components/ArticleManagement';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) return;
  
      try {
        const response = await fetch(`http://localhost:3000/auth/role/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
  
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="home-bg">
      <nav className="home-nav">
        <div className="home-nav-inner">
          <h1 className="home-title">Article Management System</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="home-main">
        {userRole === 'student' && <Articles />}
        {(userRole === 'tutor' || userRole === 'admin') && (
          <ArticleManagement userRole={userRole} />
        )}
      </main>
    </div>
  );
};

export default Home;