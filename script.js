
let selectedFiles = [];
let isProcessing = false;
let extractedTexts = [];
let foundTexts = [];
let cartItems = []; // Panier de téléchargement

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
        fileList.classList.add('hidden');
        return;
    }

    fileList.classList.remove('hidden');
    filesContainer.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>PDF Document</p>
                    <span style="color: #999; font-size: 0.8rem;">${formatFileSize(file.size)}</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFile(${index})">
                ❌ Supprimer
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

    // Vider le panier
    cartItems = [];
    updateCartDisplay();
}

// Fonction pour mettre à jour les boutons
function updateButtons() {
    if (selectedFiles.length > 0) {
        processBtn.classList.remove('hidden');
        clearBtn.classList.remove('hidden');
    } else {
        processBtn.classList.add('hidden');
        clearBtn.classList.add('hidden');
    }
}

// Fonction pour masquer les sections
function hideSections() {
    processingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    hideCart();
}

// Fonction pour formater la taille des fichiers
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Fonction pour traiter les fichiers PDF (reproduit FIDÈLEMENT la logique de facture.py)
async function processFiles() {
    if (selectedFiles.length === 0 || isProcessing) return;

    isProcessing = true;
    processBtn.disabled = true;
    processBtn.innerHTML = '<span class="spinner"></span> Traitement...';
    
    // Afficher la section de traitement
    processingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    
    const results = [];
    const documents = [];
    const documentNames = [];
    // extractedTexts et foundTexts sont maintenant des variables globales
    extractedTexts = []; // Vider le tableau pour le nouveau traitement
    foundTexts = []; // Vider le tableau pour le nouveau traitement

    try {
        // Étape 1: Charger tous les documents (comme dans facture.py)
        console.log("Chargement des documents...");
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            documentNames.push(file.name);
            
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            documents.push(pdfDoc);
            
            // Mettre à jour le progrès
            const progress = ((i + 1) / selectedFiles.length) * 25; // 25% pour le chargement
            progressFill.style.width = progress + '%';
            progressText.textContent = `Chargement de ${file.name}... ${Math.round(progress)}%`;
        }

        // Étape 2: Afficher le nombre de pages (comme dans facture.py)
        console.log("Analyse des pages...");
        const pageCounts = [];
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            const pageCount = doc.getPageCount();
            pageCounts.push(pageCount);
            console.log(`Le nombre de pages de ${documentNames[i]} est : ${pageCount}`);
        }

        // Étape 3: Charger la première page de chaque document
        console.log("Chargement des premières pages...");
        const pages = [];
        for (let i = 0; i < documents.length; i++) {
            if (documents[i].getPageCount() > 0) {
                pages.push(documents[i].getPage(0));
            } else {
                throw new Error(`${documentNames[i]} ne contient aucune page`);
            }
        }

        // Étape 4: Rechercher les textes spécifiques dans chaque page
        console.log("Recherche des textes spécifiques...");
        const searchResults = [];
        const foundTexts = []; // Stocker les informations de texte trouvé

        // Utiliser pdf.js pour extraire le texte et trouver les coordonnées
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            // Mettre à jour le progrès
            const progress = 25 + ((i + 1) / selectedFiles.length) * 25; // 25-50% pour la lecture
            progressFill.style.width = progress + '%';
            progressText.textContent = `Lecture de ${file.name}... ${Math.round(progress)}%`;

            try {
                // Charger le PDF avec pdf.js pour l'extraction de texte
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;

                if (pdf.numPages > 0) {
                    const page = await pdf.getPage(1); // Première page

                    // Extraire le texte de la page
                    const textContent = await page.getTextContent();
                    const items = textContent.items;

                    // Chercher les textes spécifiques selon le type de document
                    let targetText = '';
                    let foundText = null;

                    // Déterminer le texte à chercher selon le nom du fichier
                    if (documentNames[i].includes('achat2')) {
                        targetText = 'Standard Cut pieces';
                    } else if (documentNames[i].includes('achat3')) {
                        targetText = 'Standard Label printing';
                    } else if (documentNames[i].includes('achat4')) {
                        targetText = 'Standard Cut pieces bowlace';
                    } else if (documentNames[i].includes('achat5')) {
                        targetText = 'Standard Cut&mold two layer';
                    } else {
                        targetText = 'Standard'; // Fallback
                    }

                    // Chercher le texte spécifique
                    for (let j = 0; j < items.length; j++) {
                        const item = items[j];
                        if (item.str.includes(targetText)) {
                            // Trouvé ! Utiliser les coordonnées de l'élément de texte
                            foundText = {
                                text: item.str,
                                rect: {
                                    x0: item.transform[4], // Position X
                                    y0: item.transform[5], // Position Y
                                    x1: item.transform[4] + item.width,
                                    y1: item.transform[5] + item.height
                                }
                            };
                            console.log(`Texte "${targetText}" trouvé dans ${file.name} aux coordonnées:`, foundText.rect);
                            break;
                        }
                    }

                    // Afficher le texte extrait (comme dans votre script Python)
                    let extractedText = '';
                    for (let j = 0; j < items.length; j++) {
                        extractedText += items[j].str + ' ';
                    }
                    console.log(`Texte extrait de ${file.name}:`, extractedText.substring(0, 200) + '...');

                    searchResults.push([foundText.rect]);
                    foundTexts.push(foundText); // Stocker les informations du texte trouvé
                    extractedTexts.push(extractedText);
                } else {
                    extractedTexts.push('Aucune page trouvée dans le PDF');
                    foundTexts.push(null); // Pas de texte trouvé
                    let standardRect = { x0: 200, y0: 140, x1: 250, y1: 152 };
                    searchResults.push([standardRect]);
                }

            } catch (error) {
                console.error(`Erreur lors de la lecture de ${file.name}:`, error);
                // Stocker un texte d'erreur
                extractedTexts.push(`Erreur lors de l'extraction du texte: ${error.message}`);
                foundTexts.push(null); // Pas de texte trouvé
                // Utiliser les coordonnées par défaut en cas d'erreur
                let standardRect = { x0: 200, y0: 140, x1: 250, y1: 152 };
                searchResults.push([standardRect]);
            }
        }

        // Étape 5: Extraire les coordonnées (comme dans votre fonction extract_coordinates)
        console.log("Extraction des coordonnées...");
        const coordinates = [];
        for (let i = 0; i < searchResults.length; i++) {
            const resList = searchResults[i];
            if (resList && resList.length > 0) {
                const rect = resList[0];
                const centerX = (rect.x0 + rect.x1) / 2;
                const centerY = (rect.y0 + rect.y1) / 2;
                coordinates.push([centerX, centerY]);
            } else {
                coordinates.push(null);
            }
        }

        // Étape 6: Modifier chaque document (comme dans votre script)
        console.log("Modification des documents...");
        for (let i = 0; i < documents.length; i++) {
            const progress = 50 + ((i + 1) / documents.length) * 50; // 50-100% pour la modification
            progressFill.style.width = progress + '%';
            progressText.textContent = `Modification de ${documentNames[i]}... ${Math.round(progress)}%`;

            try {
                const doc = documents[i];
                const page = pages[i];
                const coord = coordinates[i];
                
                if (coord) {
                    // Utiliser les coordonnées du texte trouvé et placer le BIN juste en dessous
                    // Le texte trouvé peut être le texte spécifique ou les coordonnées par défaut

                    let xPos, yPos;

                    if (foundTexts[i] && foundTexts[i].rect) {
                        // Utiliser les coordonnées du texte trouvé
                        xPos = foundTexts[i].rect.x0; // Même position X que le texte trouvé
                        yPos = foundTexts[i].rect.y0 - 15; // 15 points en dessous du texte trouvé
                        console.log(`Placement du BIN sous "${foundTexts[i].text}" aux coordonnées (${xPos}, ${yPos})`);
                    } else {
                        // Fallback aux coordonnées par défaut
                        if (documentNames[i].includes('achat2') || i === 0) {
                            xPos = 229.44;
                            yPos = 140.51 - 15; // 15 points en dessous de la position par défaut
                        } else if (documentNames[i].includes('achat4') || i === 1) {
                            xPos = 208.08;
                            yPos = 140.51 - 15; // 15 points en dessous de la position par défaut
                        } else if (documentNames[i].includes('achat3') || i === 2) {
                            xPos = 221.64;
                            yPos = 140.51 - 15; // 15 points en dessous de la position par défaut
                        } else {
                            xPos = coord[0];
                            yPos = coord[1] - 15; // 15 points en dessous des coordonnées trouvées
                        }
                    }
                    
                    // Insérer le texte BIN (comme dans votre script)
                    page.drawText(' (BIN : XXXXX)', {
                        x: xPos,
                        y: yPos,
                        size: 9,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                    
                    console.log(`Texte BIN ajouté à ${documentNames[i]} aux coordonnées (${xPos}, ${yPos}) - En haut du PDF`);
                }
                
                // Sauvegarder le PDF modifié
                const pdfBytes = await doc.save();
                
                // Créer un blob et un lien de téléchargement
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                // Générer un nom de fichier avec timestamp (comme dans votre script)
                const timestamp = Math.floor(Date.now() / 1000);
                const nameWithoutExt = documentNames[i].replace('.pdf', '');
                const outputFilename = `${nameWithoutExt}_modified_${timestamp}.pdf`;
                
                results.push({
                    original_name: documentNames[i],
                    filename: outputFilename,
                    url: url,
                    success: true,
                    coordinates: coord
                });
                
                console.log(`Document modifié sauvegardé: ${outputFilename}`);
                
            } catch (error) {
                results.push({
                    original_name: documentNames[i],
                    error: error.message,
                    success: false
                });
            }
        }
        
        // Ajouter les fichiers réussis au panier et afficher les erreurs
        const failedFiles = [];
        results.forEach(result => {
            if (result.success) {
                addToCart(result);
            } else {
                failedFiles.push(result);
            }
        });

        // Afficher les erreurs s'il y en a
        if (failedFiles.length > 0) {
            displayFailedResults(failedFiles);
            resultsSection.classList.remove('hidden');
        } else {
            resultsSection.classList.add('hidden');
        }

        processingSection.classList.add('hidden');

        console.log("Traitement terminé avec succès!");
        
    } catch (error) {
        console.error('Erreur générale:', error);
        progressText.textContent = 'Erreur lors du traitement';
        alert('Une erreur est survenue lors du traitement des fichiers: ' + error.message);
    } finally {
        isProcessing = false;
        processBtn.disabled = false;
        processBtn.innerHTML = '⚙️ Traiter les fichiers';
    }
}

// Fonction pour afficher les résultats échoués
function displayFailedResults(failedResults) {
    resultsContainer.innerHTML = '';
    const debugInfo = document.getElementById('debugInfo');
    const debugContainer = document.getElementById('debugContainer');
    const textContainer = document.getElementById('textContainer');

    // Afficher le texte extrait de chaque PDF
    textContainer.innerHTML = '';
    failedResults.forEach((result, index) => {
        const textItem = document.createElement('div');
        textItem.className = 'debug-item';
        textItem.innerHTML = `
            <strong>${result.original_name}:</strong><br>
            <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 0.8rem; max-height: 100px; overflow-y: auto;">
                ${extractedTexts[results.indexOf(result)] ? extractedTexts[results.indexOf(result)].substring(0, 300) + '...' : 'Texte non extrait'}
            </div>
        `;
        textContainer.appendChild(textItem);
    });

    // Afficher les informations de debug
    debugContainer.innerHTML = '';
    debugInfo.classList.remove('hidden');

    failedResults.forEach(result => {
        const debugItem = document.createElement('div');
        debugItem.className = 'debug-item';

        debugItem.innerHTML = `
            <strong>${result.original_name}:</strong> ❌ Erreur<br>
            <strong>Message:</strong> ${result.error}
        `;

        debugContainer.appendChild(debugItem);
    });

    // Afficher les erreurs
    failedResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        resultItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">⚠️</div>
                <div class="file-details">
                    <h4>${result.original_name}</h4>
                    <p style="color: #dc3545;">Erreur: ${result.error}</p>
                </div>
            </div>
        `;

        resultsContainer.appendChild(resultItem);
    });
}

// Fonction pour ajouter un fichier au panier
function addToCart(fileData) {
    cartItems.push(fileData);
    updateCartDisplay();
    showCartNotification(`${fileData.original_name} ajouté au panier`);
}

// Fonction pour supprimer un fichier du panier
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
}

// Fonction pour mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartContainer = document.getElementById('cartContainer');
    const cartItemsContainer = document.getElementById('cartItems');

    // Mettre à jour le compteur
    cartCount.textContent = cartItems.length;

    // Afficher/masquer le panier
    if (cartItems.length > 0) {
        cartContainer.style.display = 'inline-block';
    } else {
        cartContainer.style.display = 'none';
        hideCart();
    }

    // Mettre à jour le contenu du panier
    cartItemsContainer.innerHTML = '';

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const fileSize = formatFileSize(item.fileSize || 0);

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.original_name}</div>
                <div class="cart-item-size">${fileSize} • PDF modifié</div>
            </div>
            <div class="cart-item-actions">
                <a href="${item.url}" class="cart-item-download" download="${item.filename}">
                    <i class="fas fa-download"></i>
                </a>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });
}

// Fonction pour afficher/masquer le panier
function toggleCart() {
    const dropdown = document.getElementById('cartDropdown');
    dropdown.classList.toggle('show');
}

// Fonction pour masquer le panier
function hideCart() {
    const dropdown = document.getElementById('cartDropdown');
    dropdown.classList.remove('show');
}

// Fonction pour télécharger tous les fichiers du panier
async function downloadAllFiles() {
    if (cartItems.length === 0) {
        alert('Le panier est vide');
        return;
    }

    try {
        const btn = document.querySelector('.download-all-btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Téléchargement...';
        btn.disabled = true;

        // Télécharger les fichiers un par un
        for (let i = 0; i < cartItems.length; i++) {
            const link = document.createElement('a');
            link.href = cartItems[i].url;
            link.download = cartItems[i].filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Petit délai entre chaque téléchargement
            if (i < cartItems.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Vider le panier après téléchargement
        setTimeout(() => {
            cartItems = [];
            updateCartDisplay();
            hideCart();
            showCartNotification('Tous les fichiers téléchargés !');
        }, 1000);

    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement des fichiers');

        // Remettre le bouton à l'état initial
        const btn = document.querySelector('.download-all-btn');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Fonction pour afficher une notification
function showCartNotification(message) {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        font-weight: 600;
        animation: slideInOut 3s ease-in-out forwards;
    `;

    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Ajouter l'animation CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInOut {
        0% { transform: translateX(100%); opacity: 0; }
        20%, 80% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Événement pour fermer le panier quand on clique en dehors
document.addEventListener('click', (e) => {
    const cartDropdown = document.getElementById('cartDropdown');
    const cartBtn = document.getElementById('cartBtn');

    if (cartDropdown && cartBtn) {
        if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            hideCart();
        }
    }
});

// Fonction pour afficher le formulaire de contact
function showContactForm() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Empêcher le scroll
}

// Fonction pour fermer le formulaire de contact
function closeContactForm() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restaurer le scroll

    // Réinitialiser le formulaire
    document.getElementById('contactForm').reset();
}

// Gestionnaire du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Simulation d'envoi (en vrai, utiliser fetch vers un serveur)
    console.log('Données du formulaire:', data);

    // Afficher un message de succès
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');

    // Fermer le modal et réinitialiser
    closeContactForm();
});

// Fermer le modal en cliquant en dehors
document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeContactForm();
    }
});

// Fermer le modal avec Échap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactForm();
    }
});

// Fonction pour changer de section
function changeSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Désactiver tous les onglets
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Activer la section demandée
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Activer l'onglet correspondant
    const targetTab = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    hideSections();
    cartItems = []; // S'assurer que le panier est vide au démarrage
    updateCartDisplay();

    // Configurer les onglets de navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.getAttribute('data-section');
            changeSection(sectionId);
        });
    });

    // S'assurer que le panier est visible
    const cartContainer = document.getElementById('cartContainer');
    if (cartContainer) {
        cartContainer.style.display = 'inline-block';
    }
});
