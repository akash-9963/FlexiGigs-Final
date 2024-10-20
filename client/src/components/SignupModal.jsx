import React, { useState } from 'react';
import axios from 'axios';
import { useStateProvider } from '../context/StateContext';
import { reducerCases } from '../context/constants';

const SignupModal = ({ closeModal }) => {
  const [identifier, setIdentifier] = useState(''); // For username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, dispatch] = useStateProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous error messages
    setError('');

    try {
      const response = await axios.post('/api/signup', { identifier, password });
      dispatch({ type: reducerCases.SET_USER, userInfo: response.data.user });
      closeModal();
    } catch (err) {
      // Check if the error response indicates an invalid input
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Signup failed. Please try again later.');
      } else {
        setError('Signup failed. Please check your input or try again later.');
      }
    }
  };

  return (
    <div className="modal">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default SignupModal;
