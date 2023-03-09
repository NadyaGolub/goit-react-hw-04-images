import React, { useEffect } from 'react';
import '../styles.css';

export const Modal = ({ onClose, image }) => {
  const { url, alt } = image;

  useEffect(() => {
    const keydownClick = evt => {
      if (evt.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', keydownClick);
    return () => {
      window.removeEventListener('keydown', keydownClick);
    };
  }, [onClose]);

  const backdropClick = evt => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="Overlay" onClick={backdropClick}>
      <div className="Modal">
        <img src={url} alt={alt} />
      </div>
    </div>
  );
};
