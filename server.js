const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Telefon ile sunucu arasındaki iletişimi izinli hale getiriyoruz
app.use(cors());
// Gelen büyük dosyaları desteklemek için sınırı artırıyoruz (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sanal harddiskimiz (Dosyalar burada geçici olarak tutulacak)
let virtualHardDisk = [];

// Ana sayfayı sunucuya bağla
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Dosya Yükleme API'si
app.post('/api/upload', (req, res) => {
    const { name, type, content } = req.body;
    if (!name || !content) {
        return res.status(400).json({ success: false, message: 'Dosya eksik!' });
    }
    
    virtualHardDisk.push({ name, type, content });
    res.json({ success: true, message: 'Dosya Render sunucusuna başarıyla yüklendi!' });
});

// Dosyaları Listeleme API'si
app.get('/api/files', (req, res) => {
    // Hafifletmek için içerikleri göndermiyoruz, sadece isim ve tip listeliyoruz
    const fileList = virtualHardDisk.map((file, index) => ({
        index,
        name: file.name,
        type: file.type
    }));
    res.json(fileList);
});

// Tek Bir Dosyayı Açma API'si
app.get('/api/files/:index', (req, res) => {
    const index = req.params.index;
    if (virtualHardDisk[index]) {
        res.json(virtualHardDisk[index]);
    } else {
        res.status(404).json({ error: 'Dosya bulunamadı!' });
    }
});

app.listen(PORT, () => {
    console.log(`Bulut Bilgisayar ${PORT} portunda canavar gibi çalışıyor!`);
});
