import { useState, useCallback } from 'react';
import ordersService from '@/services/ordersService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getOrders(params);
      const list = data?.orders ?? data ?? [];
      setOrders(list);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch orders';
      setError(message);
      setOrders([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getOrderById(orderId);
      setOrder(data);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch order';
      setError(message);
      setOrder(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrder = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
    setError(null);
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    clearOrder,
    clearOrders,
  };
};

export default useOrders;
