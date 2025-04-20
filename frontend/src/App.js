import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import './App.css';
import logoImage from './images/logo192.png'; // Ajuste o caminho conforme sua imagem

function Message({ msg, index }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(msg.sender === 'bot' && msg.isNew);

  useEffect(() => {
    if (isTyping) {
      let currentText = '';
      let i = 0;
      const interval = setInterval(() => {
        currentText += msg.text[i];
        setDisplayedText(currentText);
        i++;
        if (i === msg.text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50); // Velocidade da animação de escrita
      return () => clearInterval(interval);
    } else {
      setDisplayedText(msg.text);
    }
  }, [isTyping, msg.text]);

  return (
    <div
      className={`mb-2 p-3 rounded-lg max-w-[80%] ${
        msg.sender === 'user'
          ? 'bg-blue-500 text-white ml-auto user-balloon'
          : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white mr-auto bot-balloon'
      } ${msg.isNew ? 'animate-slideUp' : ''}`}
    >
      {msg.sender === 'bot' ? (
        <ReactMarkdown>{displayedText}</ReactMarkdown>
      ) : (
        displayedText
      )}
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user', isNew: true };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', { // Ajuste para Azure App Service na implantação
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot', isNew: true };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center p-4">
      <div className="mt-4 w-full max-w-md flex justify-between items-center mb-4">
      <div className="flex items-center space-x-1">
          <img src={logoImage} alt="chatEVT Logo"className="logo-image"/>
          <div className="font-[Ubuntu] text-2xl font-bold text-blue-500 dark:text-blue-100">ChatEVT</div>
      </div>
      <label className="theme-toggle">
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
            className="hidden"
          />
          <div className="toggle-circle"></div>
        </label>
      </div>
      <div className="font-[Ubuntu] mt-2 w-full text-sm max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <Message key={index} msg={msg} index={index} />
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-l-lg border dark:bg-gray-700 dark:text-white"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;