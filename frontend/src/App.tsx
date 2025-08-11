import { useEffect, useState } from 'react';
import { getBackendHealth } from './api';
import ChatInterface from './components/ChatInterface';

const App = () => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    getBackendHealth().then(setMessage);
  }, []);

  return (
    <div>
      <h1>PDF NotebookLM Clone (Frontend)</h1>
      <p>Backend health: {message}</p>
      <ChatInterface />
    </div>
  );
};

export default App;
