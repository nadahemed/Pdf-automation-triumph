// Variables globales
let selectedFiles = [];
let isProcessing = false;

// Éléments DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const filesContainer = document.getElementById('filesContainer');
const processBtn = document.getElementById('processBtn');
const clearBtn = document.getElementById('clearBtn');
const processingSection = document.getElementById('processingSection');
const resultsSection = document.getElementById('resultsSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsContainer = document.getElementById('resultsContainer');

// Événements de drag & drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    addFiles(files);
});

// Événement de sélection de fichiers
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
});

// Fonction pour ajouter des fichiers
function addFiles(files) {
    files.forEach(file => {
        if (file.type === 'application/pdf' && !selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });
    updateFileList();
    updateButtons();
}

// Fonction pour mettre à jour la liste des fichiers
function updateFileList() {
    if (selectedFiles.length === 0) {
        fileList.style.display = 'none';
        return;
    }

    fileList.style.display = 'block';
    filesContainer.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-pdf file-icon"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>PDF Document</p>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
            </div>
            <button class="btn-secondary" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        filesContainer.appendChild(fileItem);
    });
}

// Fonction pour supprimer un fichier
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
    updateButtons();
}

// Fonction pour effacer tous les fichiers
function clearFiles() {
    selectedFiles = [];
    fileInput.value = '';
    updateFileList();
    updateButtons();
    hideSections();
}

// Fonction pour mettre à jour les boutons
function updateButtons() {
    if (selectedFiles.length > 0) {
        processBtn.style.display = 'inline-flex';
        clearBtn.style.display = 'inline-flex';
    } else {
        processBtn.style.display = 'none';
        clearBtn.style.display = 'none';
    }
}

// Fonction pour masquer les sections
function hideSections() {
    processingSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

// Fonction pour formater la taille des fichiers
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Fonction pour traiter les fichiers
async function processFiles() {
    if (selectedFiles.length === 0 || isProcessing) return;

    isProcessing = true;
    processBtn.disabled = true;
    processBtn.innerHTML = '<span class="spinner"></span> Traitement...';
    
    // Afficher la section de traitement
    processingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Simuler le progrès
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Traitement en cours... ${Math.round(progress)}%`;
    }, 200);

    try {
        // Créer FormData pour l'upload
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        // Envoyer les fichiers au serveur
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors du traitement des fichiers');
        }

        const result = await response.json();
        
        // Terminer le progrès
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressText.textContent = 'Traitement terminé !';

        // Afficher les résultats après un délai
        setTimeout(() => {
            displayResults(result);
            processingSection.style.display = 'none';
            resultsSection.style.display = 'block';
        }, 1000);

    } catch (error) {
        console.error('Erreur:', error);
        clearInterval(progressInterval);
        progressText.textContent = 'Erreur lors du traitement';
        alert('Une erreur est survenue lors du traitement des fichiers. Veuillez réessayer.');
    } finally {
        isProcessing = false;
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-cogs"></i> Traiter les fichiers';
    }
}

// Fonction pour afficher les résultats
function displayResults(result) {
    resultsContainer.innerHTML = '';
    
    if (result.success && result.files) {
        result.files.forEach(file => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf file-icon"></i>
                    <div class="file-details">
                        <h4>${file.original_name}</h4>
                        <p>Fichier traité avec succès</p>
                    </div>
                </div>
                <a href="/download/${file.filename}" class="download-btn" download>
                    <i class="fas fa-download"></i> Télécharger
                </a>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <div class="file-info">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="file-details">
                        <h4>Erreur</h4>
                        <p>${result.error || 'Une erreur est survenue'}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    hideSections();
});


