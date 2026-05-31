const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzLcuofZPN-hKL--9lM6DyMxeDrqnjeA07EiKzbM-iJ1KgrBnNULiRWesUB5BKxs0Mq/exec";

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('statusMessage');
const photoGrid = document.getElementById('photoGrid');
const loading = document.getElementById('loading');

document.addEventListener('DOMContentLoaded', loadPhotos);

function loadPhotos() {
    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            photoGrid.innerHTML = '';
            
            data.reverse().forEach(file => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                
                // CORRECCIÓN: Añadido el div contenedor de la imagen para liberar los botones
                card.innerHTML = `
                    <div class="photo-image-container">
                        <img src="${file.viewUrl}" alt="Foto" loading="lazy">
                    </div>
                    <div class="photo-actions">
                        <a href="${file.downloadUrl}" class="btn-download" target="_blank">
                            <i class="fas fa-download"></i> Descargar
                        </a>
                    </div>
                `;
                photoGrid.appendChild(card);
            });
        })
        .catch(error => {
            loading.textContent = "Error al conectar con la galería.";
            console.error(error);
        });
}

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    showStatus("Subiendo archivo...", "info");

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
                showStatus("¡Subida completada!", "success");
                fileInput.value = ""; 
                loadPhotos();
                setTimeout(() => { statusMessage.style.display = 'none'; }, 3000);
            } else {
                showStatus("Error al guardar archivo.", "error");
            }
        })
        .catch(error => {
            showStatus("Error de red.", "error");
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
