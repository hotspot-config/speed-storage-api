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

// GET - استرجاع السرعة (بناءً على username)
app.get('/speed', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.json({
            success: false,
            error: 'Missing username parameter'
        });
    }

    const data = readData();

    if (data[username]) {
        res.json({
            success: true,
            speed_id: data[username].speed_id,
            speed_name: data[username].speed_name,
            username: username
        });
    } else {
        res.json({
            success: false,
            error: 'No speed found for this user',
            username: username
        });
    }
});

// POST - حفظ السرعة (بناءً على username)
app.post('/speed', (req, res) => {
    const { username, speed_id, speed_name } = req.body;

    if (!username || !speed_id || !speed_name) {
        return res.json({
            success: false,
            error: 'Missing username, speed_id or speed_name'
        });
    }

    const data = readData();
    data[username] = {
        speed_id,
        speed_name,
        timestamp: Date.now()
    };
    writeData(data);

    res.json({
        success: true,
        message: 'Speed saved',
        username: username
    });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.json({
        status: 'Speed Storage API is running (v2 - by username)',
        endpoints: {
            'GET /speed?username=XXX': 'Get saved speed for username',
            'POST /speed': 'Save speed {username, speed_id, speed_name}'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Speed Storage API v2 running on port ${PORT}`);
});
