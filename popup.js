// Popup script for interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Function to load SVG content
    async function loadSvgIcon(buttonId, svgPath) {
        try {
            const response = await fetch(svgPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const svgText = await response.text();
            const button = document.getElementById(buttonId);
            if (button) {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                if (svgElement) {
                    // Clear existing content (placeholder SVG)
                    button.innerHTML = '';
                    // Add classes for styling/sizing
                    svgElement.classList.add('h-[26px]', 'w-[26px]');
                    button.appendChild(svgElement);
                } else {
                    console.error('Could not find SVG element within the fetched file.');
                }
            } else {
                console.error(`Button with ID '${buttonId}' not found.`);
            }
        } catch (error) {
            console.error('Error loading SVG:', error);
        }
    }

    // Load the logo SVG
    loadSvgIcon('logo-button', 'icon.svg');

    // Get references to elements needed across the script
    const logoButton = document.getElementById('logo-button');
    const chatContainer = document.getElementById('chat-container');
    const featuresContainer = document.getElementById('features-container');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');
    const placeholder = document.querySelector('.placeholder');
    const selectedWebModelText = document.getElementById('selected-web-model');
    const selectedGptModelText = document.getElementById('selected-gpt-model');

    // Add click listener to logo button for reset
    logoButton.addEventListener('click', () => {
        // Clear the chat container
        chatContainer.innerHTML = '';

        // Show features and hide chat
        featuresContainer.style.display = 'flex';
        chatContainer.style.display = 'none';

        // Optional: Reset model selections to default if needed
        // currentWebModel = 'Turbo';
        // currentGptModel = 'GPT 4o Mini';
        // selectedWebModelText.textContent = currentWebModel;
        // selectedGptModelText.textContent = currentGptModel;

        // Optional: Reset input field
        // chatInput.value = '';
        // placeholder.style.opacity = '0.6';
        // sendButton.disabled = true;
    });

    // Add click event listeners to feature items
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            // Could implement navigation to different sections/features
            console.log('Feature clicked:', item.querySelector('.feature-text span:first-child').textContent);
        });
    });

    // Variables to store current model selections
    let currentWebModel = 'Turbo';
    let currentGptModel = 'GPT 4o Mini';

    // Dropdown functionality for Web Access model
    const accessWebButton = document.getElementById('access-web-button');
    const webModelDropdown = document.getElementById('web-model-dropdown');
    const webModelItems = webModelDropdown.querySelectorAll('.dropdown-item');

    accessWebButton.addEventListener('click', () => {
        webModelDropdown.classList.toggle('show');
        // Hide the other dropdown if it's open
        gptModelDropdown.classList.remove('show');
    });

    webModelItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedModel = item.getAttribute('data-value');
            selectedWebModelText.textContent = selectedModel;
            currentWebModel = selectedModel;
            webModelDropdown.classList.remove('show');
        });
    });

    // Dropdown functionality for GPT model
    const gptModelButton = document.getElementById('gpt-model-button');
    const gptModelDropdown = document.getElementById('gpt-model-dropdown');
    const gptModelItems = gptModelDropdown.querySelectorAll('.dropdown-item');

    gptModelButton.addEventListener('click', () => {
        gptModelDropdown.classList.toggle('show');
        // Hide the other dropdown if it's open
        webModelDropdown.classList.remove('show');
    });

    gptModelItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedModel = item.getAttribute('data-value');
            selectedGptModelText.textContent = selectedModel;
            currentGptModel = selectedModel;
            gptModelDropdown.classList.remove('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!accessWebButton.contains(event.target) && !webModelDropdown.contains(event.target)) {
            webModelDropdown.classList.remove('show');
        }
        if (!gptModelButton.contains(event.target) && !gptModelDropdown.contains(event.target)) {
            gptModelDropdown.classList.remove('show');
        }
    });

    // Initially, show features and hide chat
    chatContainer.style.display = 'none';
    featuresContainer.style.display = 'flex';

    // Handle placeholder visibility
    chatInput.addEventListener('focus', () => {
        if (!chatInput.value.trim()) {
            placeholder.style.opacity = '0.3';
        }
    });

    chatInput.addEventListener('blur', () => {
        if (!chatInput.value.trim()) {
            placeholder.style.opacity = '0.6';
        }
    });

    chatInput.addEventListener('input', () => {
        if (chatInput.value.trim()) {
            placeholder.style.opacity = '0';
            sendButton.disabled = false;
        } else {
            placeholder.style.opacity = '0.6';
            sendButton.disabled = true;
        }
    });

    // Send message when clicking send button
    sendButton.addEventListener('click', sendMessage);

    // Send message when pressing Enter in input
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Switch to chat mode if not already in chat mode
            if (featuresContainer.style.display === 'flex') {
                chatContainer.style.display = 'flex';
                featuresContainer.style.display = 'none';

                // Small delay to ensure DOM is updated before adding message
                setTimeout(() => {
                    // Add user message to chat
                    addMessage(message, 'user');

                    // Generate response based on current model selection
                    let response = generateDummyResponse(message, currentGptModel, currentWebModel);

                    // Add assistant response to chat with a slight delay to simulate processing
                    setTimeout(() => {
                        addMessage(response, 'assistant');
                    }, 500);

                    // Clear input
                    chatInput.value = '';
                    placeholder.style.opacity = '0.6';
                    sendButton.disabled = true;
                }, 10);
            } else {
                // Add user message to chat
                addMessage(message, 'user');

                // Generate response based on current model selection
                let response = generateDummyResponse(message, currentGptModel, currentWebModel);

                // Add assistant response to chat with a slight delay to simulate processing
                setTimeout(() => {
                    addMessage(response, 'assistant');
                }, 500);

                // Clear input
                chatInput.value = '';
                placeholder.style.opacity = '0.6';
                sendButton.disabled = true;
            }
        }
    }

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');

        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('assistant-message');
        }

        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);

        // Scroll to bottom of chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function generateDummyResponse(message, gptModel, webModel) {
        // Generate different responses based on selected model
        if (gptModel === 'GPT 4') {
            return "Xin chào tôi là GPT 4";
        } else if (gptModel === 'GPT 3.5') {
            return "Xin chào tôi là GPT 3.5";
        } else if (gptModel === 'GPT 4o Mini') {
            return "Xin chào tôi là GPT 4o Mini";
        } else {
            return "Xin chào tôi là trợ lý AI!";
        }
    }

    // Image upload functionality
    const imageButton = document.querySelector('.input-actions .icon-button');

    imageButton.addEventListener('click', () => {
        console.log('Image upload clicked');
        // Implement image upload functionality here
    });
}); 