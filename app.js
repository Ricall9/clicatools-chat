/* -------------------- Identificador único del visitante -------------------- */
let userId = localStorage.getItem('clicatools_id');

if (!userId) {
  // Navegadores modernos: crypto.randomUUID()
  if (window.crypto && crypto.randomUUID) {
    userId = crypto.randomUUID();
  } else {
    // Fallback: timestamp + número aleatorio
    userId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
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
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight; // autoscroll al final
};

/* -------------------- Enviar mensaje -------------------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, 'user');    // burbuja del usuario
  msgInput.value = '';

  try {
    const res = await fetch(
      'https://hook.us2.make.com/wnnftj140mu7yd4mvconfbl1jh1snan3',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'clicatools',
          user_id: userId,
          message: text
        })
      }
    );

    const data = await res.json();           // Make devuelve { reply: "..." }
    addMsg(data.reply || 'Sin respuesta', 'bot');
  } catch (err) {
    console.error(err);
    addMsg('Error de conexión 🛑', 'bot');
  }
});
