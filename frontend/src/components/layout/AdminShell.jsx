import React from 'react';
import AdminRoute from '@/routes/AdminRoute';
import AdminSidebar from './AdminSidebar';
import Header from './Header';

const AdminShell = ({ children }) => {
  return (
    <AdminRoute>
      <div className="admin-shell" style={styles.shell}>
        <Header />
        <div className="admin-shell__body" style={styles.body}>
          <AdminSidebar />
          <main className="admin-shell__main" style={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
  },
};

export default AdminShell;
