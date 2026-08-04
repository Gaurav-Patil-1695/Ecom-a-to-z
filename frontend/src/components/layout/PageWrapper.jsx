import React from 'react';

const PageWrapper = ({ children, style }) => {
  return (
    <div
      className="page-wrapper"
      style={{
        ...styles.wrapper,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default PageWrapper;
