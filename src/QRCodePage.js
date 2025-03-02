// QRCodePage.js
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QRCodePage.css'; 

const QRCodePage = () => {
  const { state } = useLocation();
  const { passData } = state || {}; // Extract passData from state
  const navigate = useNavigate();

  const upiId = 'mathan@oksbi';
  const payeeName = 'Rajalakshmi G';

  const generateUpiLink = (amount, upiId, payeeName) => {
    if (amount <= 0) {
      return '';
    }
    const formattedAmount = parseFloat(amount).toFixed(2);
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR`;
  };

  const handlePaymentSuccess = () => {
    navigate('/download', {
      state: { passData }, // Pass the same passData to Download page
    });
  };

  if (!passData) {
    navigate('/');
    return null;
  }

  const totalFare = passData.isSubscribed ? passData.subscriptionAmount : 0;

  return (
    <div className="payment-page">
      <header className="payment-header">
        <h1>Payment Page</h1>
        {passData.isSubscribed && (
          <p>Total Fare: ₹{totalFare.toFixed(2)}</p>
        )}
        {!passData.isSubscribed && (
          <p>Total Fare: ₹0.00</p>
        )}
        <h2>Scan the QR Code to Pay</h2>
        {totalFare > 0 ? (
          <QRCodeSVG 
            value={generateUpiLink(totalFare, upiId, payeeName)} 
            size={300} 
            level="H"
          />
        ) : (
          <p>No payment required for non-subscribed pass.</p>
        )}
        {totalFare > 0 && (
          <button onClick={handlePaymentSuccess}>Payment Successful - Download Bill</button>
        )}
        {!passData.isSubscribed && (
          <button onClick={handlePaymentSuccess}>Proceed to Download</button>
        )}
      </header>
    </div>
  );
};

export default QRCodePage;
