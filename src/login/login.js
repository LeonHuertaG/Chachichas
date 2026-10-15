
const loginForm = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const mostrarPassword = document.getElementById('mostrarPassword');
const mensaje = document.getElementById('mensaje');
const btnLogin = document.getElementById('btnLogin');

// MOSTRAR CONTRASEÑA

mostrarPassword.addEventListener('click', () => {
    const mostrar = passwordInput.type === 'password';

    passwordInput.type = mostrar ? 'text' : 'password';

    mostrarPassword.innerHTML = mostrar
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
});

// MOSTRAR MENSAJES

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    mensaje.style.display = 'block';
    mensaje.style.backgroundColor = '#ffe8e4';
    mensaje.style.color = '#ad343e';
}

// INICIAR SESIÓN

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value;

    if (!usuario || !password) {
        mostrarMensaje('Completa todos los campos.');
        return;
    }

    btnLogin.disabled = true;
    btnLogin.textContent = 'Verificando...';
    mensaje.style.display = 'none';

    try {
        const respuesta = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                usuario,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje || 'Usuario o contraseña incorrectos.'
            );
            return;
        }

        // Guardar información básica del usuario
        sessionStorage.setItem(
            'usuario',
            JSON.stringify(datos.usuario)
        );

        // Redirigir al dashboard
        window.location.href = '../dashboard/dashboard.html';

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('No se pudo conectar con el servidor.');
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar sesión';
    }
});
