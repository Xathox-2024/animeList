(function () {
  if (window.cookieConsent === 'accepted') {
    loadGA();
  } else {
    window.addEventListener("cookie-consent-accepted", function () {
      loadGA();
    });
  }

  function loadGA() {
    if (window.GA_LOADED) return; 
    window.GA_LOADED = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"; 
    document.head.appendChild(s);

    const inline = document.createElement("script");
    inline.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXX'); // ton ID GA
    `;
    document.head.appendChild(inline);
  }
})();
