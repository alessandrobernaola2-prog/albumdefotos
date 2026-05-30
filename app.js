// ACUÉRDATE DE REVISAR QUE ESTA SEA TU URL EXACTA
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzLcuofZPN-hKL--9lM6DyMxeDrqnjeA07EiKzbM-iJ1KgrBnNULiRWesUB5BKxs0Mq/exec";

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('statusMessage');
const photoGrid = document.getElementById('photoGrid');
const loading = document.getElementById('loading');

// 1. Cargar las fotos apenas se abre la página
document.addEventListener('DOMContentLoaded', loadPhotos);

function loadPhotos() {
    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none'; // Ocultar mensaje de carga
            photoGrid.innerHTML = ''; // Limpiar galería
            
            // Invertimos para que las más nuevas salgan primero
            data.reverse().forEach(file => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                card.innerHTML = `
                    <img src="${file.viewUrl}" alt="${file.name}" loading="lazy">
                    <div class="photo-actions">
                        <span style="font-size:0.8rem; color:#747d8c;">${file.name.substring(0, 15)}...</span>
                        <a href="${file.downloadUrl}" class="btn-download" download>
                            <i class="fas fa-download"></i> Descargar
                        </a>
                    </div>
                `;
                photoGrid.appendChild(card);
            });
        })
        .catch(error => {
            loading.textContent = "Error al cargar la galería.";
            console.error(error);
        });
}

// 2. Lógica para subir fotos (similar a la que tenías)
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    showStatus("Subiendo foto... Por favor espera", "info");

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        const payload = {
            base64: base64Data,
            filename: file.name,
            mimeType: file.type
        };

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showStatus("¡Foto subida con éxito! Actualizando galería...", "success");
                fileInput.value = ""; 
                // Recargar la galería para mostrar la nueva foto
                loadPhotos();
                setTimeout(() => { statusMessage.className = 'status-hidden'; }, 3000);
            } else {
                showStatus("Error: " + data.message, "error");
            }
        })
        .catch(error => {
            showStatus("Error de conexión", "error");
            console.error(error);
        });
    };
    reader.readAsDataURL(file);
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}
