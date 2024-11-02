import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ServiceForm from './ServiceForm';
import FarePage from './FarePage';
import PaymentPage from './PaymentPage';
import TicketPage from './TicketPage/TicketPage'; 
import BusPass from './BusPass';
import ChatApp from './ChatApp';
import FeedbackPage from './FeedbackPage';
import QRCodePage from './QRCodePage';
import Download from './Download';
// Import the TicketPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/fare" element={<FarePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/service" element={<ServiceForm />} />
        <Route path="/ticket" element={<TicketPage />} /> 
        <Route path="/pass" element={<BusPass />} /> {/* Add the TicketPage route */}
        <Route path="/chat" element={<ChatApp />} /> {/* Add the TicketPage route */}
        <Route path="/feedback" element={<FeedbackPage />} /> {/* Add the TicketPage route */}
        {/* Add the TicketPage route */}
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/download" element={<Download />} />

      </Routes>
    </Router>
  );
};

export default App;
