/* -------------------- Identificador único del visitante -------------------- */
let userId = localStorage.getItem('clicatools_id');

if (!userId) {
  // Genera un número aleatorio de 10 dígitos
  userId = Math.floor(1e9 + Math.random() * 9e9).toString();
  localStorage.setItem('clicatools_id', userId);
}

/* -------------------- Elementos del DOM -------------------- */
const chatBox  = document.getElementById('chat-box');
const form     = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');

/* -------------------- Función para añadir burbujas -------------------- */
const addMsg = (text, cls) => {
  const el = document.createElement('div');
  el.className = `message ${cls}`;
  el.innerHTML = text; // permite HTML como <a>

  // Enlaces externos seguros
  el.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
};

/* -------------------- Enviar mensaje -------------------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, 'user'); // Mensaje del usuario
  msgInput.value = '';

  // Obtiene el nombre guardado en localStorage
  const userName = window.getChatUserName?.() || 'Anónimo';

  try {
    const res = await fetch('https://hook.us2.make.com/wnnftj140mu7yd4mvconfbl1jh1snan3', {
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

    // Intenta extraer el campo "reply" si viene como texto plano
    const match = textResponse.match(/"reply"\s*:\s*"([\s\S]*?)"\s*}/);
    if (match && match[1]) {
      const reply = match[1].replace(/\\"/g, '"');
      addMsg(reply, 'bot');
    } else {
      addMsg('⚠️ Lo siento, no tengo permiso para responder eso.', 'bot');
      console.warn('Respuesta cruda:', textResponse);
    }

  } catch (err) {
    console.error('Error al conectar con el servidor:', err);
    addMsg('🛑 Error de conexión', 'bot');
  }
});
