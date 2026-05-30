const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzLcuofZPN-hKL--9lM6DyMxeDrqnjeA07EiKzbM-iJ1KgrBnNULiRWesUB5BKxs0Mq/exec";

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('statusMessage');

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    showStatus("Procesando archivo original...", "info");

    const reader = new FileReader();
    
    // Leer el archivo como DataURL para convertirlo a Base64 puro
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        
        const payload = {
            base64: base64Data,
            filename: file.name,
            mimeType: file.type
        };

        showStatus("Subiendo a la nube en calidad original...", "info");

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showStatus("¡Foto subida con éxito en máxima calidad! 🎉", "success");
                fileInput.value = ""; // Limpiar input
            } else {
                showStatus("Error al subir: " + data.message, "error");
            }
        })
        .catch(error => {
            showStatus("Error de conexión con el servidor", "error");
            console.error(error);
        });
    };

    reader.readAsDataURL(file);
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
}
