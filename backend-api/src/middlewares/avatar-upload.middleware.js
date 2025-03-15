const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn thư mục lưu trữ
const uploadDir = path.join(__dirname, '../public/uploads');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình bộ nhớ và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Đường dẫn thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Tạo middleware upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn dung lượng 5MB
});

const avatarUpload = upload.single('avatarFile');

module.exports = avatarUpload;