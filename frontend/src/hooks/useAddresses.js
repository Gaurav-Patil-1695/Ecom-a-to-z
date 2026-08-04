import { useState, useCallback } from 'react';
import addressesService from '@/services/addressesService';

const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.getAddresses();
      const list = data?.addresses ?? data ?? [];
      setAddresses(list);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch addresses';
      setError(message);
      setAddresses([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddressById = useCallback(async (addressId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.getAddressById(addressId);
      setAddress(data);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch address';
      setError(message);
      setAddress(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.createAddress(payload);
      setAddresses((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to create address';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.updateAddress(addressId, payload);
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? { ...a, ...data } : a))
      );
      setAddress((prev) =>
        prev && prev.id === addressId ? { ...prev, ...data } : prev
      );
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to update address';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    try {
      setLoading(true);
      setError(null);
      await addressesService.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      setAddress((prev) => (prev && prev.id === addressId ? null : prev));
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to delete address';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAddress = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  const clearAddresses = useCallback(() => {
    setAddresses([]);
    setError(null);
  }, []);

  return {
    addresses,
    address,
    loading,
    error,
    fetchAddresses,
    fetchAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    clearAddress,
    clearAddresses,
  };
};

export default useAddresses;
