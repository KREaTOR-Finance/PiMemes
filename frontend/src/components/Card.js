import React from 'react';

const cardStyle = {
  background: 'linear-gradient(to bottom, rgba(106, 13, 173, 0.2), rgba(0, 0, 0, 1))',
  border: '1px solid rgba(106, 13, 173, 0.3)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)'
};

const titleStyle = {
  color: '#FFD700',
  fontWeight: 'bold',
  fontSize: '20px',
  marginBottom: '16px'
};

const Card = ({ 
  children, 
  title, 
  style = {}, 
  titleStyle: customTitleStyle = {} 
}) => {
  return (
    <div style={{ ...cardStyle, ...style }}>
      {title && (
        <h2 style={{ ...titleStyle, ...customTitleStyle }}>{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Card; 