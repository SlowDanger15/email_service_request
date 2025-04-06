import emailjs from '@emailjs/browser';

export default async function handler(req, res) {
  console.log("💡 Request received");
  console.log("Request: ", req);

  if (req.method !== 'POST') {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  console.log("✅ POST request accepted");

  const { from_name, from_email, subject, message } = req.body;

  console.log("📦 Payload received:");
  console.log("From Name:", from_name);
  console.log("From Email:", from_email);
  console.log("Subject:", subject);
  console.log("Message:", message);

  console.log("🔐 Using environment variables:");
  console.log("EMAILJS_SERVICE_ID:", process.env.EMAILJS_SERVICE_ID);
  console.log("EMAILJS_TEMPLATE_ID:", process.env.EMAILJS_TEMPLATE_ID);
  console.log("EMAILJS_PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY);

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        from_name,
        from_email,
        subject,
        message,
      },
      process.env.EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Email sent successfully!");
    console.log("📨 EmailJS response:", response);

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.log("🔥 Error sending email:", error);
    return res.status(500).json({ success: false, error: error.text || error.message });
  }
}
