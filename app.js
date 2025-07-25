/* -------------------- Identificador único del visitante -------------------- */
let userId = localStorage.getItem('clicatools_id');

if (!userId) {
  userId = Math.floor(1e9 + Math.random() * 9e9).toString();
  localStorage.setItem('clicatools_id', userId);
}

/* -------------------- Elementos del DOM -------------------- */
const chatBox  = document.getElementById('chat-box');
const form     = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');

/* -------------------- Función para añadir burbujas al DOM -------------------- */
const addMsg = (text, cls) => {
  const el = document.createElement('div');
  el.className = `message ${cls}`;
  el.innerHTML = text;

  el.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
};

/* -------------------- Función para guardar en localStorage -------------------- */
const saveToHistory = (role, text) => {
  const history = JSON.parse(localStorage.getItem('chatHistorial')) || [];
  history.push({ role, text });
  localStorage.setItem('chatHistorial', JSON.stringify(history));
};

/* -------------------- Cargar historial guardado -------------------- */
window.addEventListener('DOMContentLoaded', () => {
  const history = JSON.parse(localStorage.getItem('chatHistorial')) || [];
  history.forEach(entry => {
    addMsg(entry.text, entry.role);
  });

  // Ocultar campo de nombre si ya está guardado
  const userName = localStorage.getItem('clicatools_username');
  if (userName) {
    const setup = document.getElementById('user-setup');
    if (setup) setup.style.display = 'none';
  }
});

/* -------------------- Enviar mensaje -------------------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  saveToHistory('user', text);
  msgInput.value = '';

  const userName = window.getChatUserName?.() || 'Anónimo';

  try {
    const res = await fetch('http://147.93.184.206/webhook/chatct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'clicatools',
        user_id: userId,
        username: userName,
        message: text
      })
    });

    const textResponse = await res.text();

    const match = textResponse.match(/"reply"\s*:\s*"([\s\S]*?)"\s*}/);
    if (match && match[1]) {
      const reply = match[1].replace(/\\"/g, '"');
      addMsg(reply, 'bot');
      saveToHistory('bot', reply);
    } else {
      addMsg('⚠️ Lo siento, no tengo permiso para responder eso.', 'bot');
      saveToHistory('bot', '⚠️ Lo siento, no tengo permiso para responder eso.');
      console.warn('Respuesta cruda:', textResponse);
    }

  } catch (err) {
    console.error('Error al conectar con el servidor:', err);
    addMsg('🛑 Error de conexión', 'bot');
    saveToHistory('bot', '🛑 Error de conexión');
  }
});
