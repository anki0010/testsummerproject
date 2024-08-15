// Registration
document.querySelector('.signup .button-field button').addEventListener('click', async function(event) {
  event.preventDefault();
  const email = document.querySelector('.signup input[type="email"]').value;
  const password = document.querySelector('.signup input[type="password"]').value;

  try {
      const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          alert('Registration successful! Please log in.');
          document.querySelector('.login-link').click(); // Switch to the login form
      } else {
          const errorData = await response.json();
          alert('Registration failed: ' + errorData.message);
      }
  } catch (error) {
      console.error('Error:', error);
  }
});

// Login
document.querySelector('.login .button-field button').addEventListener('click', async function(event) {
  event.preventDefault();
  const email = document.querySelector('.login input[type="email"]').value;
  const password = document.querySelector('.login input[type="password"]').value;

  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          window.location.href = 'index.html';
      } else {
          const errorData = await response.json();
          alert('Login failed: ' + errorData.message);
      }
  } catch (error) {
      console.error('Error:', error);
  }
});
