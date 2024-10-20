import React, { useState } from 'react';
import axios from 'axios';
import { useStateProvider } from '../context/StateContext';
import { reducerCases } from '../context/constants';

const LoginModal = ({ closeModal }) => {
  const [identifier, setIdentifier] = useState(''); // For email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, dispatch] = useStateProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('/api/login', { identifier, password });
      dispatch({ type: reducerCases.SET_USER, userInfo: response.data.user });
      closeModal();
    } catch (err) {
      // Handle error response and display relevant message
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="modal">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text" // Keep as text to accept any string
          placeholder="Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required // Make field required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default LoginModal;
