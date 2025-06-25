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

    // Verifica si la respuesta fue exitosa (código HTTP 200–299)
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    if (data && typeof data.reply === 'string' && data.reply.trim()) {
      addMsg(data.reply, 'bot');
    } else {
      addMsg('⚠️ El servidor respondió, pero sin mensaje válido.', 'bot');
      console.warn('Respuesta inesperada:', data);
    }

  } catch (err) {
    console.error('Error al procesar la respuesta:', err);
    addMsg('Error de conexión 🛑 (ver consola)', 'bot');
  }

});
