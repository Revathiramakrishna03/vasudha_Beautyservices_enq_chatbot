function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
    const inputField = document.getElementById('chatbot-input');
    const message = inputField.value;
    if (message.trim() === '') return;

    // Display the user's message
    displayMessage('You: ' + message);

    // Send the message to the Rasa server
    fetch('http://localhost:5005/webhooks/rest/webhook', { // Change this URL to your Rasa server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: 'user', message: message })
    })
    .then(response => response.json())
    .then(data => {
        // Display the bot's response
        data.forEach(response => {
            displayMessage('Bot: ' + response.text);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('Bot: Sorry, I am having trouble connecting to the server.');
    });

    // Clear the input field
    inputField.value = '';
}

// Add event listener for Enter key
document.getElementById('chatbot-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function displayMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}