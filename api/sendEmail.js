import emailjs from '@emailjs/browser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

//   const { from_name, from_email, subject, message } = req.body;
  const { name, email, subject, message } = req.body;

  try {
    const response = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          subject,
          message,
        },
        process.env.EMAILJS_PUBLIC_KEY
      );

    return res.status(200).json({ success: true, response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.text });
  }
}
