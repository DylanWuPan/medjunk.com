document.addEventListener("DOMContentLoaded", () => {
  // Hamburger toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  // Fade in page
  document.body.classList.add("fade-in");

  // Smooth page fade-out before navigating
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.hostname !== window.location.hostname) return;
      if (link.hash && link.pathname === window.location.pathname) return;

      e.preventDefault();
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location = link.href;
      }, 500); // match CSS transition
    });
  });

  // Quote form submission
  const quoteForm = document.querySelector(".quote-form");
  const submitButton = quoteForm.querySelector("button");

  // Frontend constants (do NOT use process.env here)
  const EMAILJS_SERVICE_ID = "service_vtm9lld";
  const EMAILJS_TEMPLATE_ID = "template_wae7m78";
  const EMAILJS_USER_ID = "X0DzPHhkSgucSRAcz";

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    try {
      // 1️⃣ Run reCAPTCHA
      const token = await grecaptcha.execute(
        "6LcYCQAsAAAAACEg8IF8fvPQQhMqyixGelhCUzL1",
        { action: "submit" }
      );

      // 2️⃣ Verify token via serverless function
      const recaptchaRes = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recaptchaToken: token }),
      });

      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success) {
        alert("Failed reCAPTCHA verification. Please try again.");
        submitButton.disabled = false;
        return;
      }

      // 3️⃣ Prepare EmailJS data
      const formData = {
        name: document.getElementById("name").value,
        hear: document.getElementById("hear").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        zipcode: document.getElementById("zipcode").value,
        pickup: document.getElementById("pickup").value,
      };

      // 4️⃣ Send email via EmailJS (frontend)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_USER_ID
      );

      console.log(formData);

      alert("Quote request sent successfully!");
      quoteForm.reset();
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please try again.");
    } finally {
      submitButton.disabled = false;
    }
  });
});
