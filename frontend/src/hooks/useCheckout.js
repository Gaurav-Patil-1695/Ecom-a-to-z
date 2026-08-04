import { useState, useCallback } from 'react';
import api from '@/api/client';

const STEPS = ['address', 'payment', 'review'];

const INITIAL_ADDRESS = {
  addressId: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pinCode: '',
  country: '',
};

const INITIAL_PAYMENT = {
  method: '',
  details: {},
};

const useCheckout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [payment, setPayment] = useState(INITIAL_PAYMENT);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const currentStepName = STEPS[currentStep];

  const goToStep = useCallback((stepIndex) => {
    const clamped = Math.max(0, Math.min(stepIndex, STEPS.length - 1));
    setCurrentStep(clamped);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const updateAddress = useCallback((fields) => {
    setAddress((prev) => ({ ...prev, ...fields }));
  }, []);

  const updatePayment = useCallback((fields) => {
    setPayment((prev) => ({ ...prev, ...fields }));
  }, []);

  const submitAddress = useCallback(async (addressPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/checkout/address', addressPayload);
      const data = response.data ?? {};
      setAddress((prev) => ({ ...prev, ...addressPayload, ...data }));
      nextStep();
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to submit address';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [nextStep]);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/checkout/review');
      const data = response.data ?? {};
      setReviewData(data);
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to fetch checkout review';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const initiatePayment = useCallback(async (paymentPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/payments/initiate', paymentPayload);
      const data = response.data ?? {};
      setPayment((prev) => ({ ...prev, ...paymentPayload, ...data }));
      nextStep();
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to initiate payment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [nextStep]);

  const placeOrder = useCallback(async (orderPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/checkout/place-order', orderPayload);
      const data = response.data ?? {};
      if (data.orderId) {
        setOrderId(data.orderId);
      }
      return data;
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Failed to place order';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAddress(INITIAL_ADDRESS);
    setPayment(INITIAL_PAYMENT);
    setReviewData(null);
    setError(null);
    setOrderId(null);
  }, []);

  return {
    steps: STEPS,
    currentStep,
    currentStepName,
    address,
    payment,
    reviewData,
    loading,
    error,
    orderId,
    goToStep,
    nextStep,
    prevStep,
    updateAddress,
    updatePayment,
    submitAddress,
    fetchReview,
    initiatePayment,
    placeOrder,
    reset,
  };
};

export default useCheckout;
