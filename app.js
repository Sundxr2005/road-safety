let map = null;
let isVoiceEnabled = false;
const synth = window.speechSynthesis;
let username = localStorage.getItem('username') || 'Guest';

const CHAT_STORAGE_KEY = 'community_chat_messages';

function getChatMessages() {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
}

function saveChatMessages(messages) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

document.addEventListener('DOMContentLoaded', function() {
    if (!username) {
        username = prompt('Please enter your username:') || 'Guest';
        localStorage.setItem('username', username);
    }
    document.getElementById('usernameDisplay').textContent = username;

    const voiceToggle = document.getElementById('voiceToggle');
    voiceToggle.addEventListener('click', toggleVoice);

    if (isVoiceEnabled) {
        speakMessage(`Welcome to the community app, ${username}!`);
    }

    updateChat();

    // Add Camera Button to Chat Input
    const chatInputArea = document.querySelector(".chat-input");
    const cameraButton = document.createElement("button");
    cameraButton.innerHTML = "📸 Camera";
    cameraButton.onclick = openCamera;
    chatInputArea.appendChild(cameraButton);
});

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceToggle = document.getElementById('voiceToggle');
    voiceToggle.innerHTML = isVoiceEnabled ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';

    if (isVoiceEnabled) {
        speakMessage('Voice feature is now enabled.');
    } else {
        synth.cancel();
    }
}

function speakMessage(message) {
    if (isVoiceEnabled && synth) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.speak(utterance);
    }
}

function showSection(section) {
    document.querySelectorAll('.content > div').forEach(div => {
        div.classList.add('hidden');
    });

    switch(section) {
        case 'map':
            document.getElementById('mapContainer').classList.remove('hidden');
            initMap();
            break;
        case 'chat':
            document.getElementById('chatContainer').classList.remove('hidden');
            updateChat();
            break;
        case 'features':
            document.getElementById('featuresContainer').classList.remove('hidden');
            if (isVoiceEnabled) {
                speakMessage('Here are the community features.');
            }
            break;
        case 'profile':
            document.getElementById('profileContainer').classList.remove('hidden');
            if (isVoiceEnabled) {
                speakMessage('This is your profile section.');
            }
            break;
        default:
            document.getElementById('welcomeContainer').classList.remove('hidden');
    }
}

function initMap() {
    if (!map) {
        map = L.map('map').setView([0, 0], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map.setView([position.coords.latitude, position.coords.longitude], 13);
            L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        });
    }
}

function updateChat() {
    const chatBox = document.getElementById('chatBox');
    const messages = getChatMessages();
    chatBox.innerHTML = messages.map(msg => {
        if (msg.type === 'text') {
            return `
                <div class="chat-message ${msg.sender === username ? 'user' : ''}">
                    <div class="username">${msg.sender}</div>
                    <div class="message">${msg.text}</div>
                    <div class="timestamp">${msg.timestamp}</div>
                </div>
            `;
        } else if (msg.type === 'image') {
            return `
                <div class="chat-message ${msg.sender === username ? 'user' : ''}">
                    <div class="username">${msg.sender}</div>
                    <div class="message">
                        📷 Image Sent <br>
                        <img src="${msg.content}" class="chat-image">
                    </div>
                    <div class="timestamp">${msg.timestamp}</div>
                </div>
            `;
        }
    }).join('');
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
        const message = {
            sender: username,
            type: 'text',
            text: input.value.trim(),
            timestamp: new Date().toLocaleTimeString(),
        };

        const messages = getChatMessages();
        messages.push(message);
        saveChatMessages(messages);

        input.value = '';
        updateChat();

        if (isVoiceEnabled) {
            speakMessage(`New message from ${message.sender}: ${message.text}`);
        }
    }
}

function sendSOSMessage() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                
                const locationName = data.display_name || `Lat: ${latitude}, Lng: ${longitude}`;
                
                const message = {
                    sender: username,
                    type: 'text',
                    text: `🚨 SOS! Emergency at: ${locationName}`,
                    timestamp: new Date().toLocaleTimeString(),
                };

                const messages = getChatMessages();
                messages.push(message);
                saveChatMessages(messages);

                updateChat();

                if (isVoiceEnabled) {
                    speakMessage(`Emergency alert sent by ${message.sender} at ${locationName}.`);
                }
            } catch (error) {
                console.error("Error fetching location name:", error);
                alert("Failed to get the exact location name. Please check your internet connection.");
            }
        }, () => {
            alert('Unable to retrieve location. Please check your settings.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function openCamera() {
    const cameraContainer = document.getElementById("cameraContainer");
    const video = document.getElementById("cameraFeed");

    cameraContainer.classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Camera access denied:", err);
            alert("Please allow camera access.");
        });
}

function closeCamera() {
    const video = document.getElementById("cameraFeed");

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    document.getElementById("cameraContainer").classList.add("hidden");
}

function captureImage() {
    const video = document.getElementById("cameraFeed");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/png");

    closeCamera();

    sendImageToChat(imageDataUrl);
}

function sendImageToChat(imageUrl) {
    const messageData = { 
        sender: username, 
        type: "image", 
        content: imageUrl, 
        timestamp: new Date().toLocaleTimeString() 
    };
    const messages = getChatMessages();
    messages.push(messageData);
    saveChatMessages(messages);
    updateChat();
}
