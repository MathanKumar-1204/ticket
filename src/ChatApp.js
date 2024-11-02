import React, { useState } from 'react';
import './ChatApp.css';
import { useNavigate } from 'react-router-dom';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();
  // Function to handle sending a message
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user's message to the conversation
    setMessages([...messages, { sender: 'User', text: inputMessage }]);

    // Call the Flask backend to get the response from Groq
    try {
      const response = await fetch('http://localhost:5000/chat', {  // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),  // Updated payload key
      });

      const data = await response.json();

      // Add the bot's response to the conversation
      setMessages(prevMessages => [...prevMessages, { sender: 'Bot', text: data.response }]);  // Updated key
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }

    // Clear the input field
    setInputMessage('');
  };
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (<div>
    <nav>
  <div className="navbar">
    <ul className="navbar-list">
      <li className="navbar-item" onClick={() => handleNavigation('/service')}>Home</li>
      <li className="navbar-item" onClick={() => handleNavigation('/pass')}>BusPass</li>
      <li className="navbar-item" onClick={() => handleNavigation('/feedback')}>Feedback</li>
      <li className="navbar-item" onClick={() => handleNavigation('/')}>Logout</li>
    </ul>
  </div>
</nav>
    <div className="chat-container">
      
      <h1>Chat with BUSBOT</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div></div>
  );
}

export default ChatApp;
