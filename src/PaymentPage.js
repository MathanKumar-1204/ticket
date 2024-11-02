import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // If you have specific styles

const PaymentPage = () => {
  const { state } = useLocation();
  const { totalFare, from, to, serviceType, count } = state || {}; // Extracting all necessary details
  const upiId = 'rajalakshmitarun2007@oksbi'; // Replace with your UPI ID
  const payeeName = 'Rajalakshmi G'; // Replace with the payee name
  const navigate = useNavigate();

  const generateUpiLink = (amount, upiId, payeeName) => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${formattedAmount}&cu=INR`;
  };
  

  // Function to handle payment callback
  const handlePaymentSuccess = () => {
    // After successful payment, navigate to the TicketPage
    navigate('/ticket', {
      state: { from, to, serviceType, count, fare: totalFare }
    });
  };

  return (
    <div className="payment-page">
      <header className="payment-header">
        <h1>Payment Page</h1>
        {totalFare ? (
          <>
            <p>Total Fare: ₹{totalFare}</p>
            <h2>Scan the QR Code to Pay</h2><QRCodeSVG 
  value={generateUpiLink(totalFare, upiId, payeeName)} 
  size={300} 
  level="H"  // High error correction
/>
            <button onClick={handlePaymentSuccess}>Download Bill</button>
          </>
        ) : (
          <p>No fare information available.</p>
        )}
      </header>
    </div>
  );
};

export default PaymentPage;