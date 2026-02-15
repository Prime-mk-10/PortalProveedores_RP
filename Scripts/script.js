document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const statusRegistro = document.getElementById('statusRegistro');
  const statusClasificacion = document.getElementById('statusClasificacion');
  const statusCompliance = document.getElementById('statusCompliance');
  const evaluacionScore = document.getElementById('evaluacionScore');
  const perfilResultado = document.getElementById('perfilResultado');
  const btnActualizar = document.getElementById('evaluarBtn');

  // Función para inicializar coherencia (según estados iniciales)
  function inicializarCoherencia() {
    const reg = statusRegistro.getAttribute('data-status');
    const clasi = statusClasificacion.getAttribute('data-status');
    const comp = statusCompliance.getAttribute('data-status');
    let completados = 0;
    if (reg === 'complete') completados++;
    if (clasi === 'complete') completados++;
    if (comp === 'complete') completados++;
    let nuevoScore = 60 + (completados * 12);
    if (completados === 3) nuevoScore = 98;
    evaluacionScore.textContent = nuevoScore + ' puntos';

    if (reg === 'complete' && clasi === 'complete' && comp === 'complete') {
      perfilResultado.textContent = 'APTO';
      perfilResultado.className = 'profile-result apto';
    } else {
      perfilResultado.textContent = 'NO APTO';
      perfilResultado.className = 'profile-result no-apto';
    }
  }

  // Función para actualizar evaluación aleatoriamente
  function actualizarEvaluacion() {
    const estadosPosibles = ['complete', 'pending'];
    
    const nuevoRegistro = estadosPosibles[Math.floor(Math.random() * 2)];
    const nuevoClasif = estadosPosibles[Math.floor(Math.random() * 2)];
    const nuevoCompliance = estadosPosibles[Math.floor(Math.random() * 2)];

    // Actualizar Registro
    statusRegistro.setAttribute('data-status', nuevoRegistro);
    statusRegistro.innerHTML = nuevoRegistro === 'complete' 
      ? '<i class="fas fa-check-circle"></i> Completo' 
      : '<i class="fas fa-clock"></i> Pendiente';

    // Actualizar Clasificación
    statusClasificacion.setAttribute('data-status', nuevoClasif);
    statusClasificacion.innerHTML = nuevoClasif === 'complete' 
      ? '<i class="fas fa-check-circle"></i> Completo' 
      : '<i class="fas fa-clock"></i> Pendiente';

    // Actualizar Compliance
    statusCompliance.setAttribute('data-status', nuevoCompliance);
    statusCompliance.innerHTML = nuevoCompliance === 'complete' 
      ? '<i class="fas fa-check-circle"></i> Validado' 
      : '<i class="fas fa-clock"></i> Pendiente';

    // Calcular score
    let completados = 0;
    if (nuevoRegistro === 'complete') completados++;
    if (nuevoClasif === 'complete') completados++;
    if (nuevoCompliance === 'complete') completados++;

    let nuevoScore = 60 + (completados * 12);
    if (completados === 3) nuevoScore = 98;
    evaluacionScore.textContent = nuevoScore + ' puntos';

    // Determinar perfil
    if (nuevoRegistro === 'complete' && nuevoClasif === 'complete' && nuevoCompliance === 'complete') {
      perfilResultado.textContent = 'APTO';
      perfilResultado.className = 'profile-result apto';
    } else {
      perfilResultado.textContent = 'NO APTO';
      perfilResultado.className = 'profile-result no-apto';
    }
  }

  // Inicializar coherencia al cargar la página
  inicializarCoherencia();

  // Asociar evento al botón
  btnActualizar.addEventListener('click', actualizarEvaluacion);

  // Opcional: interacción ligera en tarjetas (solo consola)
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      const titulo = this.querySelector('h5')?.innerText || 'tarjeta';
      console.log(`Vista rápida: ${titulo} (simulación)`);
    });
  });
});