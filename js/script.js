// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Store the full conversation history
    const conversationHistory = [];

    // Toggle chat visibility and swap icons
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        openIcon.style.display = chatBox.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = chatBox.classList.contains('active') ? 'block' : 'none';
    });

    // Handle user input and process messages
    async function handleUserInput(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';

            // Display the user's message
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);

            // Add user message to conversation history
            conversationHistory.push({
                role: 'user',
                content: message
            });

            // Call OpenAI API with the full conversation
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: conversationHistory
                    })
                });

                const data = await response.json();
                const aiResponse = data.choices[0].message.content;

                // Add AI response to conversation history
                conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                // Display the AI's response
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                botMessage.textContent = aiResponse;
                chatMessages.appendChild(botMessage);

            } catch (error) {
                // Display error message if API call fails
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('message', 'bot');
                errorMessage.textContent = 'Sorry, something went wrong. Please try again.';
                chatMessages.appendChild(errorMessage);
                console.error('Error:', error);
            }

            // Scroll to the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Listen for form submission
    document.getElementById('chatForm').addEventListener('submit', handleUserInput);
}

// Initialize the chat interface
initChat();
