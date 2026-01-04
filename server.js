const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS للسماح بالوصول من أي مصدر
app.use(cors());
app.use(express.json());

// ملف تخزين البيانات
const DATA_FILE = path.join(__dirname, 'speed_data.json');

// قراءة البيانات
function readData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading data:', e);
    }
    return {};
}

// كتابة البيانات
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error writing data:', e);
    }
}

// الحصول على IP العميل
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.ip ||
        'unknown';
}

// GET - استرجاع السرعة
app.get('/speed', (req, res) => {
    const clientIP = getClientIP(req);
    const data = readData();

    if (data[clientIP]) {
        res.json({
            success: true,
            speed_id: data[clientIP].speed_id,
            speed_name: data[clientIP].speed_name,
            ip: clientIP
        });
    } else {
        res.json({
            success: false,
            error: 'No speed found for this IP',
            ip: clientIP
        });
    }
});

// POST - حفظ السرعة
app.post('/speed', (req, res) => {
    const clientIP = getClientIP(req);
    const { speed_id, speed_name } = req.body;

    if (!speed_id || !speed_name) {
        return res.json({
            success: false,
            error: 'Missing speed_id or speed_name'
        });
    }

    const data = readData();
    data[clientIP] = {
        speed_id,
        speed_name,
        timestamp: Date.now()
    };
    writeData(data);

    res.json({
        success: true,
        message: 'Speed saved',
        ip: clientIP
    });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.json({
        status: 'Speed Storage API is running',
        endpoints: {
            'GET /speed': 'Get saved speed for your IP',
            'POST /speed': 'Save speed {speed_id, speed_name}'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Speed Storage API running on port ${PORT}`);
});
