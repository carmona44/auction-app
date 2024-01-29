import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';

export default function ToastMessage({
  id,
  message,
  bg,
}: {
  id: number;
  message: string;
  bg: string;
}) {
  const [toasts, setToasts] = useState(() => {
    const storedToasts = localStorage.getItem('toasts');
    return storedToasts ? JSON.parse(storedToasts) : [];
  });

  useEffect(() => {
    if (id !== 0) {
      const newToast = { id, message, bg };
      setToasts((prevToasts: any[]) => [...prevToasts, newToast]);
      localStorage.setItem('toasts', JSON.stringify([...toasts, newToast]));
    }
  }, [id]);

  const handleShowToast = (id: number) => {
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
          onClose={() => handleShowToast(toast.id)}
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
