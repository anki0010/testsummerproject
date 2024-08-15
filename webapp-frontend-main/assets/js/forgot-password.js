document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;

    // For now, we'll just log the email to the console
    // Later this will be sent to the server to handle password reset
    console.log(`Password reset requested for: ${email}`);

    // Placeholder: Redirect to a page saying the link was sent
    alert('If an account with this email exists, a password reset link has been sent.');
});
