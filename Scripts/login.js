document.addEventListener('DOMContentLoaded', function() {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const btnPublica = document.getElementById('btnPublica');
  const btnPrivada = document.getElementById('btnPrivada');
  const btnVolver = document.getElementById('btnVolver');
  const tipoSeleccionadoSpan = document.getElementById('tipoSeleccionado');
  const loginForm = document.getElementById('loginForm');
  const errorDiv = document.getElementById('errorMessage');

  let tipoContratacion = ''; // 'publica' o 'privada'

  // Usuarios de prueba embebidos (fallback si no carga el JSON)
  const USUARIOS_EMBEBIDOS = [
    { username: "proveedor_pub", password: "proveedor123", perfil: "proveedor_publico" },
    { username: "institucion_pub", password: "institucion123", perfil: "institucion_publica" },
    { username: "privado", password: "privado123", perfil: "proveedor_privado" }
  ];

  // Mostrar paso 2 con el tipo seleccionado
  function mostrarPaso2(tipo) {
    tipoContratacion = tipo;
    tipoSeleccionadoSpan.textContent = tipo === 'publica' ? 'Contratación Pública' : 'Contratación Privada';
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  }

  btnPublica.addEventListener('click', () => mostrarPaso2('publica'));
  btnPrivada.addEventListener('click', () => mostrarPaso2('privada'));

  btnVolver.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    loginForm.reset();
    errorDiv.style.display = 'none';
  });

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    errorDiv.style.display = 'none';

    try {
      let users = [];

      // Intentar cargar desde JSON, si falla usar embebidos
      try {
        const response = await fetch('data/users.json');
        if (response.ok) {
          users = await response.json();
        } else {
          throw new Error('No se pudo cargar el JSON');
        }
      } catch (fetchError) {
        console.warn('Usando usuarios embebidos por fallo en fetch');
        users = USUARIOS_EMBEBIDOS;
      }

      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.style.display = 'block';
        return;
      }

      // Validar coherencia con el tipo de contratación seleccionado
      const perfilValido = (tipoContratacion === 'publica' && (user.perfil === 'proveedor_publico' || user.perfil === 'institucion_publica')) ||
                           (tipoContratacion === 'privada' && user.perfil === 'proveedor_privado');

      if (!perfilValido) {
        errorDiv.textContent = 'El usuario no corresponde al tipo de contratación seleccionado';
        errorDiv.style.display = 'block';
        return;
      }

      // Guardar sesión
      sessionStorage.setItem('tianguis_perfil', user.perfil);
      sessionStorage.setItem('tianguis_usuario', user.username);
      sessionStorage.setItem('tianguis_tipo', tipoContratacion); // opcional

      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error al validar login:', error);
      errorDiv.textContent = 'Error en la autenticación';
      errorDiv.style.display = 'block';
    }
  });
});