// Onboarding JavaScript - Handles first-time setup
document.addEventListener('DOMContentLoaded', () => {
  const onboardingForm = document.getElementById('onboardingForm');

  if (onboardingForm) {
    onboardingForm.addEventListener('submit', handleOnboarding);
  }
});

/**
 * Handle onboarding form submission
 * @param {Event} event - Form submission event
 */
async function handleOnboarding(event) {
  event.preventDefault();

  const studyTopic = document.getElementById('studyTopic').value.trim();
  const errorDiv = document.getElementById('errorMessage');

  // Reset error message
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';

  if (!studyTopic) {
    errorDiv.textContent = 'Please enter a study topic.';
    errorDiv.style.display = 'block';
    return;
  }

  try {
    // Store study topic in localStorage for use in dashboard
    localStorage.setItem('currentStudyTopic', studyTopic);
    localStorage.setItem('onboardingCompleted', 'true');

    // Redirect to dashboard
    window.location.href = '/frontend/views/dashboard.html';
  } catch (error) {
    console.error('Onboarding error:', error);
    errorDiv.textContent = 'An error occurred. Please try again.';
    errorDiv.style.display = 'block';
  }
}