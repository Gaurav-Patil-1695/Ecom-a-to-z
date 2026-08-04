import { useMemo } from 'react';
import useAuth from '@/hooks/useAuth';

const useRoles = () => {
  const { user } = useAuth();

  const roles = useMemo(() => {
    if (!user) return [];
    return user.roles ?? user.role ? [user.role] : [];
  }, [user]);

  const hasRole = useMemo(() => {
    return (role) => {
      if (!role) return false;
      return roles.includes(role);
    };
  }, [roles]);

  const hasAnyRole = useMemo(() => {
    return (roleList = []) => {
      if (!Array.isArray(roleList) || roleList.length === 0) return false;
      return roleList.some((role) => roles.includes(role));
    };
  }, [roles]);

  const hasAllRoles = useMemo(() => {
    return (roleList = []) => {
      if (!Array.isArray(roleList) || roleList.length === 0) return false;
      return roleList.every((role) => roles.includes(role));
    };
  }, [roles]);

  const isAdmin = useMemo(() => roles.includes('admin'), [roles]);

  return { roles, hasRole, hasAnyRole, hasAllRoles, isAdmin };
};

export default useRoles;
