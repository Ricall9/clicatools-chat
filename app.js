const chatBox  = document.getElementById('chat-box');
const form     = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');

/* Crea burbuja */
const addMsg = (text, cls) => {
  const el = document.createElement('div');
  el.className = `message ${cls}`;
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
};

/* Enviar mensaje */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  msgInput.value = '';

  try {
    const res = await fetch(
      'https://hook.us2.make.com/wnnftj140mu7yd4mvconfbl1jh1snan3',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'clicatools',
          message: text
        })
      }
    );

    const data = await res.json();           // Make debe responder { reply:"..." }
    addMsg(data.reply || 'Sin respuesta', 'bot');
  } catch (err) {
    console.error(err);
    addMsg('Error de conexión 🛑', 'bot');
  }
});
