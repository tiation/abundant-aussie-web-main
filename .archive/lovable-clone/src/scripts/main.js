document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatinput');
    const sendButton = document.getElementById('send-button');

    chatInput.addEventListener('input', () => {
        // Enable send button only if chat input has text
        if (chatInput.value.trim().length > 0) {
            sendButton.disabled = false;
        } else {
            sendButton.disabled = true;
        }
    });

    // Event listener for form submission
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Your request is being processed!');
    });

    // Example interaction for adding a file or more options
    document.querySelectorAll('.btn-icon, .btn-small').forEach(button => {
        button.addEventListener('click', () => {
            alert('Option will be implemented soon!');
        });
    });
});
