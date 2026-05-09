// Main JavaScript - Handles routing and page initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is authenticated
  const user = await checkAuthentication();

  // Get the current path from the URL
  const path = window.location.pathname;

  // Route user based on authentication status and URL
  if (path === '/frontend/views/login.html' || path === '/login') {
    // User is on login page - stays there
    return;
  }

  if (path === '/frontend/views/register.html' || path === '/register') {
    // User is on register page - stays there
    return;
  }

  if (path === '/frontend/views/onboarding.html' || path === '/onboarding') {
    // User is on onboarding page
    if (!user) {
      // Not logged in - redirect to login
      window.location.href = '/frontend/views/login.html';
    }
    // User is logged in - stays on onboarding
    return;
  }

  if (path === '/frontend/views/dashboard.html' || path === '/dashboard') {
    // User is on dashboard page
    if (!user) {
      // Not logged in - redirect to login
      window.location.href = '/frontend/views/login.html';
    }
    // User is logged in - stays on dashboard
    return;
  }

  // Root path - route based on authentication
  if (user) {
    // User is logged in - check if they've completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (hasCompletedOnboarding) {
      window.location.href = '/frontend/views/dashboard.html';
    } else {
      window.location.href = '/frontend/views/onboarding.html';
    }
  } else {
    // Not logged in - show landing page or redirect to login
    window.location.href = '/frontend/views/login.html';
  }
});

/**
 * Check if user is authenticated by verifying session with backend
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
async function checkAuthentication() {
  try {
    const response = await fetch('http://localhost:5001/api/current-user', {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success && data.user) {
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Authentication check error:', error);
    return null;
  }
}

// Export for use in other scripts
window.checkAuthentication = checkAuthentication;