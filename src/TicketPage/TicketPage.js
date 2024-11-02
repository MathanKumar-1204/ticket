import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import './TicketPage.css';

const TicketPage = () => {
  const { state } = useLocation();
  const { from, to, serviceType, count, fare } = state || {};
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const generatePDF = () => {
    const ticket = document.getElementById('ticket');
    html2canvas(ticket).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('ticket.pdf');
    });
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="ticket-container">
    
      <div id="ticket" className="ticket">
        <h1 className="app-name">BBC</h1>
        <div className="ticket-details">
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Service Type:</strong> {serviceType}</p>
          <p><strong>Count:</strong> {count}</p>
          <p><strong>Fare:</strong> ₹{fare}</p>
          <p><strong>Date:</strong> {currentDate}</p>
          <p><strong>Time:</strong> {currentTime}</p>
        </div>
        <p className="fare-paid">Fare Paid!</p>
      </div>
      <div className="ticket-actions">
        <button onClick={generatePDF}>Download Bill</button>
        <button onClick={printTicket}>Print Ticket</button>
      </div>
    </div>
    
  );
};

export default TicketPage;
