import axios from "axios";

const API_URL = "http://localhost:8080/api/email";

export const sendEmail = async (to: string, cc: string, subject: string, body: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_URL}/send`, null, {
        params: { to, cc, subject, body },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      return "Failed to send email.";
    }
  };



  export const sendEmailWithAttachment = async (emailData: { to: string; cc?: string; subject: string; body: string }, file?: File) => {
  try {
    const formData = new FormData();
    formData.append("to", emailData.to);
    if (emailData.cc) formData.append("cc", emailData.cc);
    formData.append("subject", emailData.subject);
    formData.append("body", emailData.body);
    if (file) formData.append("attachment", file);

    const response = await axios.post(`${API_URL}/send-email`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
console.log(response)
    return response.data;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return null;
  }
};