document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
    if (!form) return;
  
    form.addEventListener('submit', (event) => {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      if (password !== confirmPassword) {
        event.preventDefault();
        alert('Les mots de passe ne correspondent pas.');
      }
    });
  });
  