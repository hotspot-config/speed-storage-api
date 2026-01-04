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

// الصفحة الرئيسية - تصميم متطور
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Speed Storage API</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cairo', sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            color: #fff;
            overflow-x: hidden;
        }
        
        /* خلفية متحركة */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
        }
        
        .bg-animation span {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.1);
            animation: move 25s linear infinite;
            bottom: -150px;
            border-radius: 50%;
        }
        
        .bg-animation span:nth-child(1) { left: 10%; width: 80px; height: 80px; animation-delay: 0s; }
        .bg-animation span:nth-child(2) { left: 20%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
        .bg-animation span:nth-child(3) { left: 35%; width: 40px; height: 40px; animation-delay: 4s; }
        .bg-animation span:nth-child(4) { left: 50%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
        .bg-animation span:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
        .bg-animation span:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
        .bg-animation span:nth-child(7) { left: 85%; width: 150px; height: 150px; animation-delay: 7s; }
        .bg-animation span:nth-child(8) { left: 5%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
        
        @keyframes move {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
        }
        
        .container {
            position: relative;
            z-index: 1;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        /* الهيدر */
        .header {
            text-align: center;
            margin-bottom: 50px;
            animation: fadeInDown 1s ease;
        }
        
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .logo {
            font-size: 80px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        h1 {
            font-size: 2.5em;
            margin: 20px 0 10px;
            background: linear-gradient(90deg, #00f5ff, #ff00ff, #00f5ff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 3s linear infinite;
        }
        
        @keyframes gradient {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }
        
        .subtitle {
            color: #aaa;
            font-size: 1.2em;
        }
        
        /* الحالة */
        .status-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeInUp 1s ease 0.3s both;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(90deg, #00ff88, #00cc66);
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: bold;
            color: #000;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 10px #00ff88; }
            to { box-shadow: 0 0 30px #00ff88, 0 0 60px #00ff88; }
        }
        
        .status-dot {
            width: 12px;
            height: 12px;
            background: #000;
            border-radius: 50%;
            animation: blink 1s ease infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        /* الإحصائيات */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-box {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .stat-box:hover {
            transform: translateY(-5px);
            border-color: #00f5ff;
            box-shadow: 0 10px 40px rgba(0, 245, 255, 0.2);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #00f5ff;
        }
        
        .stat-label {
            color: #888;
            margin-top: 5px;
        }
        
        /* نقاط النهاية */
        .endpoints {
            animation: fadeInUp 1s ease 0.6s both;
        }
        
        .endpoints h2 {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .endpoint {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            border-right: 4px solid #00f5ff;
            transition: all 0.3s ease;
        }
        
        .endpoint:hover {
            background: rgba(0, 245, 255, 0.1);
            transform: translateX(-5px);
        }
        
        .method {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 0.9em;
            margin-left: 10px;
        }
        
        .method.get { background: #00cc66; color: #000; }
        .method.post { background: #ff9500; color: #000; }
        
        .endpoint-url {
            font-family: monospace;
            color: #00f5ff;
            font-size: 1.1em;
        }
        
        .endpoint-desc {
            color: #aaa;
            margin-top: 10px;
        }
        
        /* الفوتر */
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #666;
            animation: fadeInUp 1s ease 0.9s both;
        }
        
        .footer a {
            color: #00f5ff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="bg-animation">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="logo">🚀</div>
            <h1>Speed Storage API</h1>
            <p class="subtitle">واجهة تخزين سرعات العملاء للهوت سبوت</p>
        </div>
        
        <div class="status-card">
            <div class="status-indicator">
                <span class="status-dot"></span>
                الخدمة تعمل بشكل ممتاز
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-number">v2</div>
                    <div class="stat-label">الإصدار</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">⚡</div>
                    <div class="stat-label">سريع</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">🔒</div>
                    <div class="stat-label">آمن</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">🌐</div>
                    <div class="stat-label">متاح دائماً</div>
                </div>
            </div>
        </div>
        
        <div class="endpoints">
            <h2>📡 نقاط النهاية (Endpoints)</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="endpoint-url">/speed?username=رقم_الكرت</span>
                <p class="endpoint-desc">استرجاع السرعة المحفوظة لمستخدم معين</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="endpoint-url">/speed</span>
                <p class="endpoint-desc">حفظ السرعة: <code>{ username, speed_id, speed_name }</code></p>
            </div>
        </div>
        
        <div class="footer">
            <p>صُمم بـ ❤️ للهوت سبوت</p>
            <p>Powered by <a href="https://render.com" target="_blank">Render.com</a></p>
        </div>
    </div>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log('Speed Storage API v2 running on port ' + PORT);
});
