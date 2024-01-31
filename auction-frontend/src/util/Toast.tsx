import React, { useCallback, useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';
import { useAuth } from '../auth/AuthProvider';

export interface ToastData {
  id: number;
  message: string;
  bg: string;
}

export default function ToastMessage(toastData: ToastData) {
  const { user } = useAuth()
  const { id } = toastData;
  const [toasts, setToasts] = useState(() => {
    const storedToasts = localStorage.getItem('toasts');
    return storedToasts ? JSON.parse(storedToasts) : [];
  });

  useEffect(() => {
    if (id !== 0) {
      const newToast: ToastData = toastData;
      handleAddToast(newToast);
    }
  }, [id]);

  useEffect(() => {
    console.log('Opening listener');
    const events = new EventSource(`${process.env.REACT_APP_API_URL}/notifications/${user?.id}`);

    const handleEvent = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);
      const newToast: ToastData = parsedData;
      handleAddToast(newToast);
    };

    events.addEventListener('message', handleEvent);

    return () => {
      console.log('Closing listener');
      events.removeEventListener('message', handleEvent);
      events.close();
    };
  }, [user]);

  const handleAddToast = (newToast: ToastData) => {
    setToasts((prevToasts: any[]) => [...prevToasts, newToast]);
    localStorage.setItem('toasts', JSON.stringify([...toasts, newToast]));
  };

  const handleCloseToast = (id: number) => {
    const updatedToasts = toasts.filter((toast: any) => toast.id !== id);
    setToasts(updatedToasts);
    localStorage.setItem('toasts', JSON.stringify(updatedToasts));
  };

  return (
    <ToastContainer className="position-absolute" style={{ top: '10vh', right: 10 }}>
      {toasts.map((toast: any) => (
        <Toast
          key={toast.id}
          bg={toast.bg}
          onClose={() => handleCloseToast(toast.id)}
          delay={4000}
          autohide
        >
          <ToastHeader>
            <strong className="me-auto">Notification</strong>
          </ToastHeader>
          <ToastBody style={{ color: 'white' }}>{toast.message}</ToastBody>
        </Toast>
      ))}
    </ToastContainer>
  );
}
