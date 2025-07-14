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

/* -------------------- Guardar y recuperar historial -------------------- */
function guardarEnHistorial(role, content) {
  const historial = JSON.parse(localStorage.getItem("chatHistorial") || "[]");
  historial.push({ role, content });
  localStorage.setItem("chatHistorial", JSON.stringify(historial));
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("chatHistorial") || "[]");
  historial.forEach(msg => {
    const cls = msg.role === "user" ? "user" : "bot";
    addMsg(msg.content, cls);
  });
}

/* -------------------- Función para añadir burbujas -------------------- */
const addMsg = (text, cls) => {
  const el = document.createElement('div');
  el.className = `message ${cls}`;
  el.innerHTML = text;

  el.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel',   'noopener noreferrer');
  });

  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
};

/* -------------------- Mostrar historial al cargar -------------------- */
mostrarHistorial();

/* -------------------- Enviar mensaje -------------------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  guardarEnHistorial("user", text);
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

    const textResponse = await res.text();

    const match = textResponse.match(/"reply"\s*:\s*"([\s\S]*?)"\s*}/);
    if (match && match[1]) {
      const reply = match[1].replace(/\\"/g, '"');
      addMsg(reply, 'bot');
      guardarEnHistorial("bot", reply);
    } else {
      addMsg('⚠️ Lo siento, no tengo permiso para responder eso.', 'bot');
      console.warn('Respuesta cruda:', textResponse);
    }

  } catch (err) {
    console.error('Error al conectar con el servidor:', err);
    addMsg('Error de conexión 🛑', 'bot');
  }
});
