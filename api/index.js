const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const archiver = require('archiver');
const {
    v4: uuidv4
} = require('uuid');
const schedule = require('node-schedule');

const app = express();
const PORT = 5000;
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({
    storage
});

const tempPathMain = path.join(__dirname, 'temp');



async function processImage(fileBuffer, originalName, tempFolder, width) {
    try {
        let formattedFileName = originalName.trim();
        formattedFileName = path.parse(formattedFileName).name + '.webp';
        const outputPath = path.join(tempFolder, formattedFileName);
        let quality = 80;
        let outputBuffer;

        do {
            outputBuffer = await sharp(fileBuffer)
                .resize({
                    width
                })
                .webp({
                    quality
                })
                .toBuffer();

            if (outputBuffer.length > 200 * 1024) {
                quality -= 10;
            }
        } while (outputBuffer.length > 200 * 1024 && quality > 10);

        fs.writeFileSync(outputPath, outputBuffer);
        return {
            fileName: formattedFileName,
            size: outputBuffer.length,
        };
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

function createZip(tempFolder, userId) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(path.join(tempFolder, `${userId}.zip`));
        const archive = archiver('zip', {
            zlib: {
                level: 9
            },
        });

        archive.pipe(output);
        archive.directory(tempFolder, false);
        archive.finalize();

        output.on('close', () => resolve());
        output.on('error', (err) => reject(err));
    });
}

function emptyFolder(folder) {
    fs.readdir(folder, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        for (const file of files) {
            const filePath = path.join(folder, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                } else {
                    console.log(`Deleted file: ${file}`);
                }
            });
        }
    });
}


app.get('/', (req, res) => {
    console.log("console");
})

app.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        const { files } = req;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded.' });
        }

        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        const invalidFiles = files.filter(file => !allowedExtensions.test(file.originalname));

        if (invalidFiles.length > 0) {
            return res.status(400).json({
                message: 'Only JPG, JPEG, and PNG files are allowed.',
                invalidFiles: invalidFiles.map(file => file.originalname),
            });
        }

        const userId = uuidv4();
        const tempFolder = path.join(tempPathMain, userId);

        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder, { recursive: true });
        }

        const results = [];
        for (let file of files) {
            const result = await processImage(file.buffer, file.originalname, tempFolder);
            results.push(result);
        }

        res.status(200).json({
            message: 'Images processed successfully.',
            results,
            userId,
            downloadLink: `/download/${userId}`,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error processing images.',
            error,
        });
    }
});



app.get('/download/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const tempFolder = path.join(__dirname, 'temp', userId);

        if (!fs.existsSync(tempFolder)) {
            return res.status(404).send('User folder not found.');
        }

        const zipFilePath = path.join(tempFolder, `${userId}.zip`);
        await createZip(tempFolder, userId);

        res.download(zipFilePath, `${userId}.zip`, (err) => {
            if (err) {
                console.error('Error downloading ZIP:', err);
                return;
            }
        });
    } catch (error) {
        console.error('Error creating ZIP:', error);
        res.status(500).send('Error creating ZIP');
    }
});

schedule.scheduleJob('0 0 * * *', () => {
    console.log('Running job to empty folder at 12:00 AM');
    emptyFolder(tempPathMain);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});