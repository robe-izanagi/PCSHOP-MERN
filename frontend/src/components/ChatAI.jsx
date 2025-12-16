import React, { useState } from 'react';
import styles from './css/chat.module.css'; // Add this import

const ChatAI = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your ASUS ROG PC Builds assistant. Ask me anything about our e-commerce platform!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);

    // Generate bot response
    const response = generateResponse(input.toLowerCase());
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500); 

    setInput('');
  };

  const generateResponse = (query) => {
    if (query.includes('location') || (query.includes('store') && !query.includes('online')) || query.includes('saan') && !query.includes('online')) {
      return `Our store is located in Malvar, Batangas, near BSU Malvar Campus. Coordinates: Latitude 14.044464779438496, Longitude 121.1575209078627. You can find us on Google Maps: https://www.google.com/maps?q=${14.044464779438496},${121.1575209078627}`;
    } else if (query.includes('online store') || query.includes('online shop') || query.includes('makakapunta') || query.includes('order page') || query.includes('umorder online')) {
      return "By clicking any 'Shop Now' button, or go to this site: http://localhost:5173/order-page";
    } else if (query.includes('asus rog') || query.includes('pc build') || query.includes('component')) {
      return "We specialize in ASUS ROG PC builds and components! From high-performance GPUs to custom motherboards, we have everything you need for your gaming rig. Browse our catalog for the latest ROG products.";
    } else if (query.includes('price') || query.includes('cost')) {
      return "Prices vary by component. Check our website for current deals on ASUS ROG items. We offer competitive pricing and bundle discounts!";
    } else if (query.includes('shipping') || query.includes('delivery')) {
      return "We ship nationwide! Orders are processed within 1-2 business days, and delivery usually takes 3-5 days depending on your location.";
    } else if (query.includes('contact') || query.includes('support')) {
      return "Reach out to us at support@asusrogbuilds.com or call +63-993-274-3220. We're here to help!";
    } else if (query.includes('feedback') || query.includes('send ng feedback')) {
      return "You can send us feedback on every item in the store.";
    } else {
      return "I'm sorry, I didn't understand that. Feel free to ask about our ASUS ROG PC builds, components, store location, or anything else related to our e-commerce platform!";
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        ASUS ROG Chat Assistant
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          placeholder="Ask me anything..." 
          className={styles.chatInput}
        />
        <button 
          onClick={handleSend} 
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatAI;
