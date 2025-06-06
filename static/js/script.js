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
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const logoutBtn = document.querySelector('.login-icon');
const closeBtns = document.querySelectorAll('.close-btn');
const sidebar = document.getElementById('pdfSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const closeSidebar = document.getElementById('closeSidebar');
const pdfList = document.getElementById('pdfList');
const uploadForm = document.getElementById('uploadForm');

// ========== INICIALIZACIÓN ========== //
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupAuthForms();
    setupEventListeners();
    setupSidebar();
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
    showLoginForm();
}

function enableMainContent(username) {
    loginModal.style.display = 'none';
    mainContent.classList.remove('content-disabled');
    mainContent.classList.add('content-enabled');
    
    // Habilitar sidebar
    sidebar.classList.add('authenticated');
    sidebarToggle.classList.add('authenticated');
    
    // Actualizar UI
    const loginIcon = document.querySelector('.login-icon i');
    loginIcon.className = 'fas fa-sign-out-alt';
    loginIcon.parentElement.setAttribute('title', 'Cerrar sesión');
    logoutBtn.onclick = logout;
    
    // Cargar PDFs si la sidebar está visible
    if (sidebar.classList.contains('active')) {
        loadPDFs();
    }
}

function disableMainContent() {
    mainContent.classList.add('content-disabled');
    mainContent.classList.remove('content-enabled');
    
    sidebar.classList.remove('authenticated', 'active');
    sidebarToggle.classList.remove('authenticated');
    
    const loginIcon = document.querySelector('.login-icon i');
    loginIcon.className = 'fas fa-user-circle';
    loginIcon.parentElement.setAttribute('title', 'Iniciar sesión');
    logoutBtn.onclick = showAuthModal;
}

// ========== MANEJO DE FORMULARIOS ========== //
function setupAuthForms() {

    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });


    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}

function showLoginForm() {
    registerFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    document.getElementById('username').focus();
}

function showRegisterForm() {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
    document.getElementById('newUsername').focus();
}

function handleCloseModal() {
    if (!localStorage.getItem('loggedInUser')) {
        alert('Debes iniciar sesión para acceder a la aplicación');
        return false;
    }
}

// ========== MANEJO DE SESIÓN ========== //
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        // Simular petición al backend
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                const authToken = Math.random().toString(36).substring(2);
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('loggedInUser', username);
                resolve(user);
            } else {
                reject(new Error('Usuario o contraseña incorrectos'));
            }
        }, 800);
    });
}

function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.username === username)) {
                reject(new Error('El nombre de usuario ya existe'));
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
    
    // Deshabilitar sidebar
    sidebar.classList.remove('authenticated', 'active');
    sidebarToggle.classList.remove('authenticated');
    
    showAuthModal();
    loginForm.reset();
    registerForm.reset();
}

// ========== MANEJADORES DE FORMULARIOS ========== //
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

// ========== SIDEBAR Y PDFs ========== //
function setupSidebar() {
    // Toggle sidebar solo si está autenticado
    sidebarToggle.addEventListener('click', function() {
        if (localStorage.getItem('loggedInUser')) {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                loadPDFs();
            }
        } else {
            showAuthModal();
        }
    });

    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    // Actualizar la lista después de subir un PDF
    if (uploadForm) {
        uploadForm.addEventListener('submit', function() {
            setTimeout(loadPDFs, 1000);
        });
    }
}

function loadPDFs() {
    // Verificar autenticación primero
    if (!localStorage.getItem('loggedInUser')) {
        return;
    }

    fetch('/get-pdfs')
        .then(response => response.json())
        .then(data => {
            pdfList.innerHTML = '';

            if (data.length === 0) {
                pdfList.innerHTML = '<div class="no-pdfs">No hay documentos subidos aún.</div>';
                return;
            }

            data.forEach(pdf => {
                const item = document.createElement('li');
                item.className = 'pdf-item';
                item.innerHTML = `
                    <i class="fas fa-file-pdf pdf-icon"></i>
                    <div class="pdf-info">
                        <div class="pdf-name">${pdf.name}</div>
                        <div class="pdf-meta">${pdf.date} • ${pdf.size}</div>
                    </div>
                    <div class="pdf-actions">
                        <a href="${pdf.url}" target="_blank" title="Ver"><i class="fas fa-eye"></i></a>
                        <a href="${pdf.url}" download title="Descargar"><i class="fas fa-download"></i></a>
                        <a href="#" class="delete-pdf" data-filename="${pdf.url.split('/').pop()}" title="Eliminar"><i class="fas fa-trash"></i></a>
                    </div>
                `;
                pdfList.appendChild(item);
            });

            document.querySelectorAll('.delete-pdf').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filename = this.getAttribute('data-filename');
                    if (confirm('¿Estás seguro de querer eliminar este archivo?')) {
                        deletePDF(filename);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar PDFs:', error);
            pdfList.innerHTML = '<div class="no-pdfs">Error al cargar los documentos</div>';
        });
}

function deletePDF(filename) {
    fetch(`/delete-pdf/${filename}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadPDFs(); // Recargar la lista
            } else {
                alert('Error al eliminar el archivo: ' + (data.error || ''));
            }
        })
        .catch(error => {
            alert('Error al eliminar el archivo');
            console.error('Error:', error);
        });
}

// ========== CONFIGURACIÓN DE EVENTOS ========== //
function setupEventListeners() {
    // Formularios
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', handleCloseModal);
    });
    
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            handleCloseModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.style.display === 'flex') {
            handleCloseModal();
        }
    });
}

// ========== EXPORTAR FUNCIONES PARA HTML ========== //
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.logout = logout;
window.handleCloseModal = handleCloseModal;