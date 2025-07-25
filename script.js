const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const inputMessage = document.getElementById('input-message');

function addMessage(username, text, isBot = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isBot ? 'B' : username[0].toUpperCase();

    const content = document.createElement('div');
    content.className = 'msg-content';
    const uname = document.createElement('div');
    uname.className = 'username';
    uname.textContent = isBot ? 'Bot' : username;
    const msgText = document.createElement('div');
    msgText.textContent = text;
    content.appendChild(uname);
    content.appendChild(msgText);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


async function botReply(userMsg) {
    addMessage('Bot', 'Thinking...', true);
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg })
        });
        const data = await response.json();
        // Remove the 'Thinking...' message
        const lastMsg = messagesDiv.lastChild;
        if (lastMsg && lastMsg.querySelector('.msg-content').textContent === 'BotThinking...') {
            messagesDiv.removeChild(lastMsg);
        } else if (lastMsg && lastMsg.querySelector('.msg-content').textContent === 'Thinking...') {
            messagesDiv.removeChild(lastMsg);
        }
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            addMessage('Bot', data.choices[0].message.content.trim(), true);
        } else {
            addMessage('Bot', 'Sorry, I could not get a response.', true);
        }
    } catch (err) {
        // Remove the 'Thinking...' message
        const lastMsg = messagesDiv.lastChild;
        if (lastMsg && lastMsg.querySelector('.msg-content').textContent === 'Thinking...') {
            messagesDiv.removeChild(lastMsg);
        }
        addMessage('Bot', 'Error: Unable to connect to AI service.', true);
    }
}

messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = inputMessage.value.trim();
    if (msg) {
        addMessage('You', msg);
        inputMessage.value = '';
        botReply(msg);
    }
});
