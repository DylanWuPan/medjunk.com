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

  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitButton.disabled = true;

    const formData = {
      name: document.getElementById("name").value,
      hear: document.getElementById("hear").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      zipcode: document.getElementById("zipcode").value,
      pickup: document.getElementById("pickup").value,
    };

    emailjs.send("service_vtm9lld", "template_wae7m78", formData).then(
      () => {
        alert("Quote request sent successfully!");
        quoteForm.reset();
        submitButton.disabled = false;
      },
      (err) => {
        alert("Failed to send quote request. Please try again.");
        console.error(err);
        submitButton.disabled = false;
      }
    );
  });
});
