import './error.css';
const Error = ({ error }) => {
  return (
    <div className='error'>
      <h1>Error: {error}</h1>
    </div>
  );
};

export default Error;
