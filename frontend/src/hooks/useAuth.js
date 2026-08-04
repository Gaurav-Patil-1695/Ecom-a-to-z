import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, isAuthenticated } = context;

  return { user, login, logout, isAuthenticated };
};

export default useAuth;
