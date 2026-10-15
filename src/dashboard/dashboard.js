
const nombreUsuario = document.getElementById('nombreUsuario');
const nombreCuenta = document.getElementById('nombreCuenta');
const usuarioCuenta = document.getElementById('usuarioCuenta');
const estadoCuenta = document.getElementById('estadoCuenta');
const estadoSesion = document.getElementById('estadoSesion');
const btnLogout = document.getElementById('btnLogout');
const contenidoDashboard = document.getElementById('contenidoDashboard');

const RUTA_LOGIN = '../login/login.html';


// REDIRIGIR AL LOGIN

function regresarLogin() {
    sessionStorage.removeItem('usuario');
    window.location.replace(RUTA_LOGIN);
}


// MOSTRAR DATOS DEL USUARIO

function mostrarUsuario(usuario) {

    nombreUsuario.textContent = usuario.nombre;
    nombreCuenta.textContent = usuario.nombre;
    usuarioCuenta.textContent = usuario.usuario;
    estadoCuenta.textContent = 'Activo';

    estadoSesion.innerHTML =
        '<i class="fa-solid fa-circle-check"></i> Sesión activa';

    contenidoDashboard.style.visibility = 'visible';
}


// VERIFICAR SESIÓN CON LA API

async function verificarSesion() {

    try {

        const respuesta = await fetch('/api/me', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!respuesta.ok) {
            regresarLogin();
            return;
        }

        const datos = await respuesta.json();

        if (!datos.usuario) {
            regresarLogin();
            return;
        }

        sessionStorage.setItem(
            'usuario',
            JSON.stringify(datos.usuario)
        );

        mostrarUsuario(datos.usuario);

    } catch (error) {

        console.error('Error al verificar sesión:', error);

        // El acceso offline se implementará con la PWA.
        // Por ahora no permitimos entrar sin validación.

        regresarLogin();
    }
}


// CERRAR SESIÓN

btnLogout.addEventListener('click', async () => {

    btnLogout.disabled = true;
    btnLogout.textContent = 'Cerrando sesión...';

    try {

        const respuesta = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo cerrar la sesión');
        }

        sessionStorage.removeItem('usuario');

        window.location.replace(RUTA_LOGIN);

    } catch (error) {

        console.error('Error al cerrar sesión:', error);

        alert('No se pudo cerrar la sesión. Inténtalo nuevamente.');

        btnLogout.disabled = false;
        btnLogout.innerHTML =
            '<i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión';
    }

});


// INICIAR DASHBOARD

verificarSesion();
