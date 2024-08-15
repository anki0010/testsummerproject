document.getElementById('reset-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // For now, we'll just log the new password to the console
    // Later this will be sent to the server to update the user's password
    console.log(`Password reset to: ${newPassword}`);

    // Placeholder: Redirect to login page after successful reset
    alert('Your password has been reset successfully. Please log in with your new password.');
    window.location.href = 'login.html';
});
