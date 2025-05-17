import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import GradeManagement from '../components/grades/GradeManagement';
import { getIcon } from '../utils/iconUtils';

function Home() {
  const [activeTab, setActiveTab] = useState('students');
  
  const GraduationCapIcon = getIcon('GraduationCap');
  const BookOpenIcon = getIcon('BookOpen');
  const CalendarCheckIcon = getIcon('CalendarCheck');
  const UsersIcon = getIcon('Users');
  
  const tabs = [
    { id: 'students', name: 'Students', icon: UsersIcon },
    { id: 'courses', name: 'Courses', icon: BookOpenIcon },
    { id: 'attendance', name: 'Attendance', icon: CalendarCheckIcon },
    { id: 'grades', name: 'Grades', icon: GraduationCapIcon },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white p-6 sm:p-8 md:p-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCapIcon size={28} />
            <h1 className="text-2xl md:text-3xl font-bold">Welcome to ScholarTrack</h1>
          </div>
          <p className="text-primary-light text-lg mb-6">
            Streamline your student management with our comprehensive dashboard.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: '256', subtitle: 'Students', color: 'bg-white/20' },
              { title: '32', subtitle: 'Courses', color: 'bg-white/20' },
              { title: '94%', subtitle: 'Attendance', color: 'bg-white/20' },
              { title: '8', subtitle: 'Alerts', color: 'bg-white/20' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.color} backdrop-blur-sm rounded-xl p-4 text-center`}
              >
                <h3 className="text-2xl md:text-3xl font-bold">{stat.title}</h3>
                <p className="text-sm text-white/80">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 mb-4">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
                }`}
              >
                <TabIcon size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="card">
          {activeTab === 'students' && <MainFeature />}
          
          {activeTab === 'courses' && (
            <div className="p-4 text-center">
              <p className="text-surface-500 dark:text-surface-400">
                Course management features will be available in the next update.
              </p>
            </div>
          )}
          
          {activeTab === 'attendance' && (
            <div className="p-4 text-center">
              <p className="text-surface-500 dark:text-surface-400">
                Attendance tracking will be available soon.
              </p>
            </div>
          )}
          
          {activeTab === 'grades' && (
            <GradeManagement />
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;