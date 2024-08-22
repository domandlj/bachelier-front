const spinnerStyle = {
  border: '4px solid rgba(0, 0, 0, 0.1)', // Light gray border
  borderRadius: '50%',
  borderTop: '4px solid #808080', // Gray color for the spinning part
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};

const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Spinner = () => (
  <div style={spinnerStyle}>
    <style>{spinnerAnimation}</style>
  </div>
);

export default Spinner;