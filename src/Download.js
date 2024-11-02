import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './Download.css';

const Download = () => {
  const { state } = useLocation();
  const { passData } = state || {};
  const navigate = useNavigate();

  // If no data, navigate back to the home page
  useEffect(() => {
    if (!passData) {
      navigate('/');
    }
  }, [passData, navigate]);

  if (!passData) {
    return null; // Avoid rendering if no pass data
  }

  const { name, aadhaarNumber, subscriptionAmount, from, to, count } = passData;
  const dateOfIssue = new Date().toLocaleDateString();

  // Function to handle PDF download
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BBC Bus Pass', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${name || 'N/A'}`, 20, 30);
    doc.text(`Aadhaar Number: ${aadhaarNumber || 'N/A'}`, 20, 40);
    doc.text(`From: ${from || 'N/A'}`, 20, 50);
    doc.text(`To: ${to || 'N/A'}`, 20, 60);
    doc.text(`Count: ${count || 'N/A'}`, 20, 70);
    doc.text(`Subscription Amount: ₹${subscriptionAmount || 'N/A'}`, 20, 80);
    doc.text(`Date of Issue: ${dateOfIssue}`, 20, 90);
    doc.text('Fare Paid!', 20, 100);

    // Add double line border for the pass
    doc.setDrawColor(0, 0, 0); // Black color
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 260); // Outer rectangle
    doc.setLineWidth(1);
    doc.rect(12, 12, 186, 256); // Inner rectangle

    // Save the PDF
    doc.save('BBC_Bus_Pass.pdf');
  };

  return (
    <div className="download-page">
      <header className="download-header">
        <h1>Bus Pass Details</h1>
        <p><strong>Name:</strong> {name || 'N/A'}</p>
        <p><strong>Aadhaar Number:</strong> {aadhaarNumber || 'N/A'}</p>
        <p><strong>From:</strong> {from || 'N/A'}</p>
        <p><strong>To:</strong> {to || 'N/A'}</p>
        <p><strong>Count:</strong> {count || 'N/A'}</p>
        <p><strong>Subscription Amount:</strong> ₹{subscriptionAmount || 'N/A'}</p>
        <p><strong>Date of Issue:</strong> {dateOfIssue}</p>
      </header>
      <div className="download-buttons">
        <button onClick={handleDownload}>Download PDF</button>
        <button onClick={() => window.print()}>Print Pass</button>
      </div>
    </div>
  );
};

export default Download;
