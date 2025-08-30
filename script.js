      // Masukkan API Key Fonnte Anda di sini
        // Dapatkan dari halaman Dashboard Fonnte
        const FONNTE_API_KEY = "4GgWL1gjtdKgCQEfLWhu";

        // Masukkan nomor WhatsApp tujuan di sini
        // Format nomor harus diawali dengan kode negara (misal: 62 untuk Indonesia)
        const TARGET_WHATSAPP_NUMBER = "628123456789"; 

        const sendButton = document.getElementById("sendLocationBtn");
        const statusMessageDiv = document.getElementById("statusMessage");
        const usernameInput = document.getElementById("username");

        // Fungsi untuk mengambil lokasi pengguna
        function getUserLocation() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject("Geolocation tidak didukung di browser Anda.");
                } else {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            resolve({ lat, lng });
                        },
                        (error) => {
                            let errorMessage = "Tidak dapat mengambil lokasi.";
                            if (error.code === error.PERMISSION_DENIED) {
                                errorMessage = "Izin lokasi ditolak. Aktifkan izin di pengaturan browser Anda.";
                            }
                            reject(errorMessage);
                        }
                    );
                }
            });
        }

        // Fungsi untuk mengirim lokasi ke WhatsApp melalui Fonnte API
        async function sendLocationToWhatsApp(lat, lng) {
            const mapsLink = `https://www.google.com/maps/place/${lat},${lng}`;
            const message = `from ${usernameInput.value}, Lokasi saya saat ini:\n${mapsLink}`;
            
            const formData = new URLSearchParams();
            formData.append('target', TARGET_WHATSAPP_NUMBER);
            formData.append('message', message);
            
            try {
                const response = await fetch('https://api.fonnte.com/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': '4GgWL1gjtdKgCQEfLWhu',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });
                
                const data = await response.json();
                
                if (data.status) {
                    return "Pesan lokasi berhasil dikirim!";
                } else {
                    return `Gagal mengirim pesan: ${data.reason}`;
                }
            } catch (error) {
                console.error("Kesalahan saat mengirim ke Fonnte:", error);
                return "Terjadi kesalahan saat menghubungi server Fonnte.";
            }
        }

        // Event listener untuk tombol
        sendButton.addEventListener("click", async () => {
            statusMessageDiv.textContent = "Meminta akses lokasi...";
            sendButton.disabled = true;

            try {
                const location = await getUserLocation();
                statusMessageDiv.textContent = `Lokasi ditemukan (${location.lat}, ${location.lng}). Mengirim...`;
                
                const result = await sendLocationToWhatsApp(location.lat, location.lng);
                statusMessageDiv.textContent = result;
                
            } catch (error) {
                statusMessageDiv.textContent = `Gagal: ${error}`;
            } finally {
                sendButton.disabled = false;
            }
        });