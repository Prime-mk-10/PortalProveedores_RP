document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorDiv = document.getElementById('errorMessage');

  // Usuarios de prueba embebidos (en caso de no poder cargar el JSON)
  const USUARIOS_EMBEBIDOS = [
    { username: "publico", password: "publico123", perfil: "publico" },
    { username: "privado", password: "privado123", perfil: "privado" }
  ];

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    errorDiv.style.display = 'none';

    try {
      let users = [];

      // Intentar cargar desde JSON, si falla usar los embebidos
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

      if (user) {
        sessionStorage.setItem('tianguis_perfil', user.perfil);
        sessionStorage.setItem('tianguis_usuario', user.username);
        window.location.href = 'index.html';
      } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      console.error('Error al validar login:', error);
      errorDiv.textContent = 'Error en la autenticación';
      errorDiv.style.display = 'block';
    }
  });
});