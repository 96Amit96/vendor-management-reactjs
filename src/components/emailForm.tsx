import React, { useState } from "react";
import { sendEmailWithAttachment } from "../services/emailService";

const EmailForm: React.FC = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendEmail = async () => {
    if (!emailData.to) {
      setMessage("⚠️ Please fill all required fields!");
      return;
    }

    setMessage("⏳ Sending email...");
    const response = await sendEmailWithAttachment(emailData, selectedFile || undefined);

    if (response) {
      setMessage("✅ Email sent successfully!");
      setEmailData({ to: "", cc: "", subject: "", body: "" });
      setSelectedFile(null);
    } else {
      setMessage("❌ Failed to send email. Try again.");
    }
  };

  return (
    <div className="container mt-4 p-4 border rounded bg-white shadow-sm" style={{ maxWidth: "500px" }}>
      <h5 className="text-center mb-3">📧 Send Email</h5>
  
      {/* To Field */}
      <div className="d-flex align-items-center mb-2">
        <label className="fw-semibold me-2" style={{ width: "70px" }}>To:</label>
        <input
          type="email"
          name="to"
          value={emailData.to}
          onChange={handleChange}
          className="form-control form-control-sm"
          placeholder="Recipient emails"
          required
        />
      </div>
  
      {/* CC Field */}
      <div className="d-flex align-items-center mb-2">
        <label className="fw-semibold me-2" style={{ width: "70px" }}>CC:</label>
        <input
          type="email"
          name="cc"
          value={emailData.cc}
          onChange={handleChange}
          className="form-control form-control-sm"
          placeholder="CC emails"
        />
      </div>
  
      {/* Subject Field */}
      <div className="d-flex align-items-center mb-2">
        <label className="fw-semibold me-2" style={{ width: "70px" }}>Subject:</label>
        <input
          type="text"
          name="subject"
          value={emailData.subject}
          onChange={handleChange}
          className="form-control form-control-sm"
          placeholder="Enter email subject"
        
        />
      </div>
  
      {/* Message Field */}
      <div className="d-flex mb-2">
        <label className="fw-semibold me-2" style={{ width: "70px" }}>Message:</label>
        <textarea
          name="body"
          value={emailData.body}
          onChange={handleChange}
          rows={3}
          className="form-control form-control-sm"
          placeholder="Write your message here..."
          
        />
      </div>
  

       {/* File Upload (Gmail-style Attach Button) */}
       <div className="d-flex align-items-center mb-2">
        <label className="fw-semibold me-1" style={{ width: "70px" }}>Attach:</label>
        <label className="btn btn-outline-secondary btn-sm d-flex align-items-center" style={{ cursor: "pointer" }}>
          📎 Attach File
          <input
            type="file"
            onChange={handleFileChange}
            className="d-none"
          />
        </label>
        {selectedFile && <span className="ms-1 text-muted">{selectedFile.name}</span>}
      </div>
  
      {/* Send Button */}
      <div className="d-grid mt-">
        <button className="btn btn-primary btn-sm" onClick={handleSendEmail}>
          📤 Send Email
        </button>
      </div>
  
      {/* Message Display */}
      {message && (
        <p className="mt-3 text-center text-muted fw-semibold" style={{ fontSize: "14px" }}>
          {message}
        </p>
      )}
    </div>
  );
  
};  

export default EmailForm;
