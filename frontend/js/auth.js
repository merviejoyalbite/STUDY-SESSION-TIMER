// Authentication JavaScript - Handles login and register functionality
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});

/**
 * Handle user login
 * @param {Event} event - Form submission event
 */
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMessage');

  // Reset error message
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';

  try {
    const response = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Login successful - redirect to onboarding
      setTimeout(() => {
        window.location.href = '/frontend/views/onboarding.html';
      }, 500);
    } else {
      // Show error message
      errorDiv.textContent = data.message || 'Login failed. Please try again.';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = 'An error occurred. Please try again.';
    errorDiv.style.display = 'block';
  }
}

/**
 * Handle user registration
 * @param {Event} event - Form submission event
 */
async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('errorMessage');

  // Reset error message
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';

  // Validate passwords match
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match.';
    errorDiv.style.display = 'block';
    return;
  }

  // Validate password length
  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters long.';
    errorDiv.style.display = 'block';
    return;
  }

  try {
    const response = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Registration successful - redirect to login
      alert('Registration successful! Please login.');
      window.location.href = '/frontend/views/login.html';
    } else {
      // Show error message
      errorDiv.textContent = data.message || 'Registration failed. Please try again.';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Registration error:', error);
    errorDiv.textContent = 'An error occurred. Please try again.';
    errorDiv.style.display = 'block';
  }
}