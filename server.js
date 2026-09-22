const express = require('express');
const cors = require('cors');

const app = express();

// ดึง PORT จาก Environment (สำหรับตอนขึ้น Cloud เช่น Render) หรือใช้ 3000 ตอนรันในเครื่อง
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // อนุญาต Cross-Origin Resource Sharing
app.use(express.json()); // ช่วยให้ Express อ่าน Request Body ที่เป็น JSON ได้

// ตัวแปรในหน่วยความจำ (RAM) จำลองการเก็บข้อมูลล่าสุด
let latestSensorData = {
    device_id: "none",
    temperature: 0,
    humidity: 0,
    updated_at: null
};

// ----------------------------------------------------
// 1. Endpoint สำหรับรับข้อมูลจาก Node-RED (HTTP POST)
// ----------------------------------------------------
app.post('/api/sensor', (req, res) => {
    const data = req.body;
    console.log("📥 [Received from Node-RED]:", data);

    // อัปเดตข้อมูลล่าสุดพร้อมบันทึกเวลาที่ได้รับ
    latestSensorData = {
        ...data,
        updated_at: new Date().toISOString()
    };

    // ตอบกลับสถานะ 200 OK ให้ Node-RED ทราบว่ารับข้อมูลสำเร็จ
    res.status(200).json({
        success: true,
        message: "บันทึกข้อมูลเรียบร้อยแล้ว"
    });
});

// ----------------------------------------------------
// 2. Endpoint สำหรับให้หน้าเว็บ Frontend ดึงไปแสดงผล (HTTP GET)
// ----------------------------------------------------
app.get('/api/sensor', (req, res) => {
    res.status(200).json(latestSensorData);
});

// Endpoint เช็กสถานะทั่วไป
app.get('/', (req, res) => {
    res.send('Node.js + Express API Server is Running!');
});

// สั่งรัน Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});