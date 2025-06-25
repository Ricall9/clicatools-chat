/* -------------------- Identificador único del visitante -------------------- */
let userId = localStorage.getItem('clicatools_id');

if (!userId) {
  // Genera un número aleatorio de 10 dígitos (entre 1000000000 y 9999999999)
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
  el.innerHTML = text;            // ← ahora interpreta HTML

  /* 👇 NUEVO: forzar target="_blank" en cada enlace que llegue */
  el.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel',   'noopener noreferrer');
  });
  
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
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

    const rawText = await res.text();

    try {
      const parsed = JSON.parse(rawText);

      if (parsed && typeof parsed.reply === 'string' && parsed.reply.trim()) {
        addMsg(parsed.reply, 'bot');
      } else {
        console.warn('Respuesta sin campo válido:', parsed);
        addMsg('⚠️ El servidor respondió, pero no se encontró el mensaje.', 'bot');
      }
    } catch (parseErr) {
      console.error('No se pudo interpretar como JSON:', rawText);
      addMsg('⚠️ La respuesta del servidor no fue válida.', 'bot');
    }

  } catch (err) {
    console.error('Error al conectar con el servidor:', err);
    addMsg('Error de conexión 🛑', 'bot');
  }
});

