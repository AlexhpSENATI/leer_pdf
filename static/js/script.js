// Manejar el área de subida
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const resultContainer = document.getElementById('resultContainer');

const predictionData = document.getElementById('predictionData');
const predictionExists = predictionData.getAttribute('data-exists') === 'true';
const predictionPercentage = Number(predictionData.getAttribute('data-percentage'));

uploadArea.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    const file = e.target.files[0];
    fileName.textContent = `Archivo seleccionado: ${file.name}`;
    uploadArea.style.borderColor = 'var(--highlight)';
  }
});

// Efecto de arrastrar y soltar
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--highlight)';
  uploadArea.style.backgroundColor = 'rgba(106, 13, 173, 0.2)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = 'var(--primary)';
  uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--highlight)';
  uploadArea.style.backgroundColor = 'transparent';

  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    fileName.textContent = `Archivo seleccionado: ${e.dataTransfer.files[0].name}`;
  }
});

// Mostrar resultados si hay predicción al cargar la página
if (predictionData) {
  const predictionExists = predictionData.getAttribute('data-exists') === 'true';
  const predictionPercentage = Number(predictionData.getAttribute('data-percentage'));

  if (predictionExists) {
    resultContainer.style.display = 'block';
    const confidenceBar = document.getElementById('confidenceBar');
    confidenceBar.style.width = predictionPercentage + '%';
  }
}





// ========== VARIABLES GLOBALES ========== //
const loginModal = document.getElementById('loginModal');
const mainContent = document.getElementById('mainContent');
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const loginLink = document.querySelector('a[onclick="showLoginForm()"]');
const registerLink = document.querySelector('a[onclick="showRegisterForm()"]');
const logoutBtn = document.querySelector('.login-icon');
const closeBtns = document.querySelectorAll('.close-btn');

// ========== INICIALIZACIÓN ========== //
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
});

// ========== FUNCIONES DE AUTENTICACIÓN ========== //
function checkAuth() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const authToken = localStorage.getItem('authToken');
    
    if (loggedInUser && authToken) {
        enableMainContent(loggedInUser);
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    loginModal.style.display = 'flex';
    disableMainContent();
    showLoginForm(); // Mostrar formulario de login por defecto
}

// ========== MANEJO DE CONTENIDO ========== //
function enableMainContent(username) {
    loginModal.style.display = 'none';
    mainContent.classList.remove('content-disabled');
    mainContent.classList.add('content-enabled');
    
    // Actualizar UI para usuario logueado
    const loginIcon = document.querySelector('.login-icon i');
    loginIcon.className = 'fas fa-sign-out-alt';
    loginIcon.parentElement.setAttribute('title', 'Cerrar sesión');
    logoutBtn.onclick = logout;
}

function disableMainContent() {
    mainContent.classList.add('content-disabled');
    mainContent.classList.remove('content-enabled');
    
    // Actualizar UI para usuario no logueado
    const loginIcon = document.querySelector('.login-icon i');
    loginIcon.className = 'fas fa-user-circle';
    loginIcon.parentElement.setAttribute('title', 'Iniciar sesión');
    logoutBtn.onclick = showAuthModal;
}

// ========== MANEJO DE SESIÓN ========== //
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        // Simular petición al backend (reemplazar con fetch en producción)
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Simular token de autenticación
                const authToken = Math.random().toString(36).substring(2);
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('loggedInUser', username);
                resolve(user);
            } else {
                reject(new Error('Credenciales incorrectas'));
            }
        }, 800);
    });
}

function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.username === username)) {
                reject(new Error('El usuario ya existe'));
            } else if (password.length < 6) {
                reject(new Error('La contraseña debe tener al menos 6 caracteres'));
            } else {
                const newUser = { username, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                resolve(newUser);
            }
        }, 800);
    });
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    showAuthModal();
}

// ========== MANEJO DE FORMULARIOS ========== //
function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('username').focus();
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('newUsername').focus();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    loginUser(username, password)
        .then(user => {
            enableMainContent(user.username);
            loginForm.reset();
        })
        .catch(error => {
            alert(error.message);
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        });
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    if (!username || !password || !confirmPassword) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('newPassword').focus();
        return;
    }
    
    registerUser(username, password)
        .then(() => {
            alert('Registro exitoso. Ahora puede iniciar sesión');
            showLoginForm();
            registerForm.reset();
        })
        .catch(error => {
            alert(error.message);
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('newUsername').focus();
        });
}

// ========== CONFIGURACIÓN DE EVENTOS ========== //
function setupEventListeners() {
    // Formularios
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);
    
    // Enlaces de cambio
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    // Botones de cerrar
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!localStorage.getItem('loggedInUser')) {
                alert('Debe iniciar sesión para usar la aplicación');
            }
        });
    });
    
    // Clic fuera del modal
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            alert('Debe iniciar sesión para usar la aplicación');
        }
    });
    
    // Manejar tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.style.display === 'flex') {
            if (!localStorage.getItem('loggedInUser')) {
                alert('Debe iniciar sesión para usar la aplicación');
            }
        }
    });
}

// ========== EXPORTAR FUNCIONES PARA HTML ========== //
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.logout = logout;