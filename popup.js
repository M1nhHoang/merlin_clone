// Popup script for interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Theme switching functionality
    const darkThemeClass = 'dark-theme';
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference using Chrome storage API
    if (chrome && chrome.storage) {
        chrome.storage.sync.get(['theme'], function (result) {
            if (result.theme === 'dark') {
                document.body.classList.add(darkThemeClass);
                updateThemeIcon(true);
            }
        });
    } else {
        // Fallback to localStorage for development
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add(darkThemeClass);
            updateThemeIcon(true);
        }
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isDarkTheme = document.body.classList.toggle(darkThemeClass);
        updateThemeIcon(isDarkTheme);

        // Save preference to Chrome storage if available
        if (chrome && chrome.storage) {
            chrome.storage.sync.set({ theme: isDarkTheme ? 'dark' : 'light' });
        } else {
            // Fallback to localStorage for development
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        }
    });

    function updateThemeIcon(isDarkTheme) {
        // Update icon based on current theme
        if (isDarkTheme) {
            themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                    <path d="M12 3v1"></path>
                    <path d="M12 20v1"></path>
                    <path d="M3 12h1"></path>
                    <path d="M20 12h1"></path>
                    <path d="M5.6 5.6l.7 .7"></path>
                    <path d="M18.4 5.6l-.7 .7"></path>
                    <path d="M17.7 17.7l.7 .7"></path>
                    <path d="M6.3 17.7l-.7 .7"></path>
                </svg>
            `;
        } else {
            themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
                </svg>
            `;
        }
    }

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
    const tokenAnalysisLink = document.getElementById('token-analysis-link');
    const yesButton = document.querySelector('.yes-button');
    const selectedWebModelText = document.getElementById('selected-web-model');
    const selectedGptModelText = document.getElementById('selected-gpt-model');

    // Add click listener to logo button for reset
    logoButton.addEventListener('click', () => {
        // Reset chat and show features
        resetChat();
    });

    // Add click event listener for the token analysis link
    if (tokenAnalysisLink) {
        tokenAnalysisLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Token analysis report link clicked');
            // Could implement navigation to the report page
        });
    }

    // Add click event listener for the yes button
    if (yesButton) {
        yesButton.addEventListener('click', () => {
            console.log('Yes button clicked');
            // Could implement website report generation functionality
        });
    }

    // Add click event listeners to feature items
    const featureItems = document.querySelectorAll('.feature-item');

    // Dummy chat flows for each feature
    const featureChatDummies = {
        'Chat with this Webpage': [
            { sender: 'user', message: 'Can you analyze the performance of Berachain token?' },
            { sender: 'assistant', message: 'Sure! Here are some highlights of Berachain:' },
            { sender: 'assistant', message: '- BeaconKit modular framework\n- EVM-identical environment\n- Rich API ecosystem\n- Multiple RPC endpoints\n- Support\n- Active developer community\n- Regular hackathons\n- Technical documentation\n- Direct team access' },
            { sender: 'assistant', message: 'For the technical goons out there: this is what peak blockchain performance looks like. No cap.' },
            { sender: 'assistant', message: 'Do you want to generate a website report for this research?' },
            { sender: 'user', message: 'Yes' },
            { sender: 'assistant', message: 'Token Analysis Report:\n[Click here to view the detailed token analysis report](#)' }
        ],
        'Chatbots': [
            { sender: 'user', message: 'Give me a summary of the BERA token.' },
            { sender: 'assistant', message: 'Token Name: Berachain (BERA)\nMarket Cap: $1,200,000,000\n24h Volume: $45,000,000\nCirculating Supply: 100,000,000 BERA\nAll Time High: $15.20\nAll Time Low: $0.80' },
            { sender: 'assistant', message: 'Summary: Berachain is a modular blockchain platform with a strong developer community and robust technical documentation. It supports EVM compatibility and offers multiple RPC endpoints for seamless integration.' },
            { sender: 'user', message: 'Can you check the website health?' },
            { sender: 'assistant', message: 'Website Health: Excellent\nSecurity: No vulnerabilities detected\nSEO Score: 92/100\nSuggestions:\n- Improve mobile responsiveness\n- Add more technical documentation\n- Increase community engagement' },
            { sender: 'assistant', message: 'Would you like to generate a full website report or view the token analysis?' }
        ],
        'Chat with your Documents': [
            { sender: 'user', message: 'Can you extract key points from this whitepaper?' },
            { sender: 'assistant', message: 'Certainly! Here are the key points from the document:\n- Modular blockchain architecture\n- EVM compatibility\n- Developer-friendly APIs\n- Active community support' },
            { sender: 'assistant', message: 'Would you like a detailed summary or a technical breakdown?' }
        ],
        'Generate Images': [
            { sender: 'user', message: 'Generate an infographic for Berachain ecosystem.' },
            { sender: 'assistant', message: 'Here is a generated infographic for the Berachain ecosystem (image preview dummy).' },
            { sender: 'assistant', message: '[Download Infographic](#)' }
        ],
        'Code Interpreter': [
            { sender: 'user', message: 'Can you analyze this CSV of token prices?' },
            { sender: 'assistant', message: 'Sure! I have detected trends and anomalies in the token price data. Would you like a chart or a statistical summary?' },
            { sender: 'user', message: 'Show me a chart.' },
            { sender: 'assistant', message: '[Chart preview dummy]\nThe chart above shows the price movement of BERA over the last 30 days.' }
        ]
    };

    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            // Show chat interface
            switchToChat();
            // Get feature name
            const featureName = item.querySelector('.text-lg').textContent;
            // Clear chat before adding dummy messages
            chatContainer.innerHTML = '';
            // Add dummy chat flow for this feature
            const chatFlow = featureChatDummies[featureName];
            if (chatFlow) {
                let delay = 0;
                chatFlow.forEach((msg, idx) => {
                    setTimeout(() => {
                        addMessage(msg.message, msg.sender);
                    }, delay);
                    delay += 700;
                });
            } else {
                // Fallback: just show welcome message
                setTimeout(() => {
                    addMessage(`Welcome to ${featureName}. How can I help you today?`, 'assistant');
                }, 400);
            }
        });
    });

    function switchToChat() {
        chatContainer.style.display = 'flex';
        featuresContainer.style.display = 'none';
    }

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

    function resetChat() {
        // Clear the chat container
        chatContainer.innerHTML = '';
        // Show features and hide chat
        chatContainer.style.display = 'none';
        featuresContainer.style.display = 'flex';
        // Reset input field
        chatInput.value = '';
        placeholder.style.opacity = '0.6';
        sendButton.disabled = true;
    }

    // Go Pro button alert
    const upgradeButton = document.querySelector('.upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', () => {
            alert('This feature is under development.');
        });
    }

    // Lightning logic
    let lightningCount = 100;
    const lightningSpan = document.querySelector('.lightning-button span');
    function updateLightning() {
        if (lightningSpan) {
            // Lấy phần tử text node cuối cùng (sau icon)
            const nodes = lightningSpan.childNodes;
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    nodes[i].textContent = ' ' + lightningCount;
                }
            }
        }
    }
    updateLightning();

    // Trừ lightning khi gửi tin nhắn user
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            if (lightningCount > 0) {
                lightningCount--;
                updateLightning();
            }
            // Switch to chat mode if not already in chat mode
            if (featuresContainer.style.display !== 'none') {
                switchToChat();
            }
            // Add user message to chat
            addMessage(message, 'user');
            // Clear input
            chatInput.value = '';
            placeholder.style.opacity = '0.6';
            sendButton.disabled = true;
            // Generate AI response with a slight delay to simulate processing
            setTimeout(() => {
                const aiResponse = generateDummyResponse(message, currentGptModel);
                addMessage(aiResponse, 'assistant');
            }, 800);
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

    function generateDummyResponse(message, model) {
        const responses = [
            "I can help you with that! Let me know if you need more information.",
            "That's an interesting question. Based on my knowledge, I'd suggest looking into...",
            "I've found some information that might help you with that.",
            "Let me analyze that for you...",
            "Here's what I know about that topic."
        ];

        const modelSpecificResponses = {
            "GPT 4": [
                "As GPT-4, I can provide a detailed analysis of this topic.",
                "GPT-4's advanced capabilities allow me to understand complex queries like this one."
            ],
            "GPT 3.5": [
                "Based on GPT-3.5's training data, I can tell you that...",
                "My GPT-3.5 capabilities help me answer this effectively."
            ],
            "GPT 4o Mini": [
                "Using GPT-4o Mini, I've analyzed your request and found...",
                "My GPT-4o Mini model is optimized for queries like this one."
            ]
        };

        // Get a standard response
        let randomIndex = Math.floor(Math.random() * responses.length);
        let response = responses[randomIndex];

        // Add some model-specific flair if available
        if (modelSpecificResponses[model] && Math.random() > 0.5) {
            randomIndex = Math.floor(Math.random() * modelSpecificResponses[model].length);
            response = modelSpecificResponses[model][randomIndex];
        }

        // Add reference to the user's message occasionally
        if (message.length > 15 && Math.random() > 0.7) {
            const words = message.split(' ');
            if (words.length > 3) {
                const randomWordIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
                const keyword = words[randomWordIndex];
                response += ` Regarding "${keyword}", I have additional insights to share.`;
            }
        }

        return response;
    }
}); 