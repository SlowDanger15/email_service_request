const emailjs = require('emailjs-com');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, email, subject, message } = req.body;

  try {
    emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        from_name: name,
        from_email: email,
        subject,
        message,
      }
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.text || err.message });
  }
};
