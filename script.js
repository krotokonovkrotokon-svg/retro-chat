// Firebase config - Sizin üçün hazır
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForDemo",
    authDomain: "retro-chat-demo.firebaseapp.com",
    databaseURL: "https://retro-chat-demo-default-rtdb.firebaseio.com",
    projectId: "retro-chat-demo",
    storageBucket: "retro-chat-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');

const chatBox = document.getElementById('chat-box');
const nickInput = document.getElementById('nick');
const msgInput = document.getElementById('msg');

// Mesajları real-time dinlə
messagesRef.limitToLast(50).on('child_added', (snapshot) => {
    const msg = snapshot.val();
    showMessage(msg.nick, msg.text, msg.time);
});

function getTime() {
    const now = new Date();
    return `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}]`;
}

function send() {
    const text = msgInput.value.trim();
    const nick = nickInput.value.trim() || 'Guest';
    
    if (!text) return;
    
    if (text === '/clear') {
        clearChat();
    } else {
        // Firebase-ə göndər
        messagesRef.push({
            nick: nick,
            text: text,
            time: getTime(),
            timestamp: Date.now()
        });
    }
    
    msgInput.value = '';
}

function showMessage(nick, text, time) {
    const div = document.createElement('div');
    div.className = 'msg';
    div.innerHTML = `<span style="color:#050">${time || getTime()}</span> <span class="username">&lt;${nick}&gt;</span> ${escape(text)}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
    messagesRef.remove();
    chatBox.innerHTML = '<div class="msg system">*** Chat təmizləndi ***</div><div class="msg system">*** /clear - Təmizləmək üçün ***</div>';
}

function escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
});

// Başlanğıc mesajları
chatBox.innerHTML = '<div class="msg system">*** Xoş gəlmisiniz! ***</div><div class="msg system">*** /clear - Təmizləmək üçün ***</div>';
