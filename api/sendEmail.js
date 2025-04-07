// import emailjs from '@emailjs/browser';

// export default async function handler(req, res) {
//   console.log("💡 Request received");
//   console.log("Request: ", req);

//   if (req.method !== 'POST') {
//     console.log("❌ Invalid request method:", req.method);
//     return res.status(405).json({ message: 'Only POST requests allowed' });
//   }

//   console.log("✅ POST request accepted");

//   const { from_name, from_email, subject, message } = req.body;

//   console.log("📦 Payload received:");
//   console.log("From Name:", from_name);
//   console.log("From Email:", from_email);
//   console.log("Subject:", subject);
//   console.log("Message:", message);

//   console.log("🔐 Using environment variables:");
//   console.log("EMAILJS_SERVICE_ID:", process.env.EMAILJS_SERVICE_ID);
//   console.log("EMAILJS_TEMPLATE_ID:", process.env.EMAILJS_TEMPLATE_ID);
//   console.log("EMAILJS_PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY);

//   try {
//     const response = await emailjs.send(
//       process.env.EMAILJS_SERVICE_ID,
//       process.env.EMAILJS_TEMPLATE_ID,
//       {
//         from_name,
//         from_email,
//         subject,
//         message,
//       },
//       process.env.EMAILJS_PUBLIC_KEY
//     );

//     console.log("✅ Email sent successfully!");
//     console.log("📨 EmailJS response:", response);

//     return res.status(200).json({ success: true, response });
//   } catch (error) {
//     console.log("🔥 Error sending email:", error);
//     return res.status(500).json({ success: false, error: error.text || error.message });
//   }
// }

export default async function handler(req, res) {
    console.log("💡 Request received");

    // ✅ Handle CORS preflight
    if (req.method === 'OPTIONS') {
        console.log("🛬 Preflight request handled");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end(); // No Content
    }
  
    if (req.method !== 'POST') {
      console.log("❌ Invalid request method:", req.method);
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // ✅ CORS headers for actual POST response
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log("✅ POST request accepted");
    // Manually parse body if not auto-parsed
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { from_name, from_email, subject, message } = data;
  
        console.log("📦 Payload received:", data);
  
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;

        console.log("🔐 Using environment variables:");
        console.log("EMAILJS_SERVICE_ID:", process.env.EMAILJS_SERVICE_ID);
        console.log("EMAILJS_TEMPLATE_ID:", process.env.EMAILJS_TEMPLATE_ID);
        console.log("EMAILJS_PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY);

  
        const payload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name,
            from_email,
            subject,
            message,
          }
        };
  
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        console.log("Response: ", response)
        // const result = await response.json();
        const contentType = response.headers.get('content-type');
        const responseBody = contentType?.includes('application/json')
            ? await response.json()
            : await response.text();
        console.log("Response Body: ", responseBody)
        if (response.ok) {
          console.log("✅ Email sent successfully!", responseBody);
          return res.status(200).json({ success: true, responseBody });
        } else {
          console.log("❌ Email sending failed:", responseBody);
          return res.status(500).json({ success: false, error: responseBody });
        }
      } catch (error) {
        console.log("🔥 Unexpected error:", error);
        return res.status(500).json({ success: false, error: error.message });
      }
    });
  }
  
