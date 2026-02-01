const fs = require('fs');
const path = require('path');

// اسم الملف النهائي
const outputFileName = 'project_code_for_ai.txt';

// المجلدات اللي هنطنشها (عشان نقلل الحجم)
const ignoredDirs = ['node_modules', '.git', 'dist', 'assets', 'environments', 'e2e'];

// الامتدادات المطلوبة فقط
const allowedExtensions = ['.ts', '.html', '.css', '.scss', '.json'];

function appendFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!ignoredDirs.includes(file)) {
                appendFiles(fullPath);
            }
        } else {
            const ext = path.extname(file);
            if (allowedExtensions.includes(ext)) {
                // فلتر إضافي: تجاهل ملفات الـ spec (ملفات التيست) لتقليل الحجم
                if (!file.endsWith('.spec.ts')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    fs.appendFileSync(outputFileName, `\n\n--- FILE: ${fullPath} ---\n\n${content}`);
                }
            }
        }
    });
}

// مسح الملف القديم لو موجود
if (fs.existsSync(outputFileName)) fs.unlinkSync(outputFileName);

console.log('Collecting code files...');
appendFiles('./src');
console.log(`Done! Created file: ${outputFileName}`);
