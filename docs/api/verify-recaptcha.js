// api/verify-recaptcha.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { recaptchaToken } = req.body;

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", recaptchaToken);

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      { method: "POST", body: params }
    );
    const data = await response.json();

    if (!data.success || data.score < 0.5) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
