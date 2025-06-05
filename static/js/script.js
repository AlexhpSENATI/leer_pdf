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