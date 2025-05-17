import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainFeature from '../components/MainFeature';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white">
            Student Management Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Welcome back, {user?.firstName || 'User'}! Manage students and their academic records.
          </p>
        </div>
        <button onClick={() => navigate('/grades')} className="btn btn-primary">View Grades</button>
      </div>
      <MainFeature />
    </div>
  );
};
export default Home;