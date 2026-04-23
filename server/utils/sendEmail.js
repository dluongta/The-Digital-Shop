import * as brevo from '@getbrevo/brevo';

const sendEmail = async ({ to, subject, html }) => {
  // 1. Khởi tạo API Client
  let defaultClient = brevo.ApiClient.instance;

  // 2. Cấu hình API Key chuẩn
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new brevo.TransactionalEmailsApi();

  // 3. Khởi tạo đối tượng Email
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { 
    name: "The Digital Shop", 
    email: "luen2k3@gmail.com" // Đảm bảo email này đã được Verify Sender trong Brevo
  };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully. Message ID: ' + data.body.messageId);
    return data;
  } catch (error) {
    console.error("Brevo SDK Error Details:", error.response?.body || error.message);
    throw new Error(error.response?.body?.message || "Lỗi gửi email qua Brevo");
  }
};

export default sendEmail;