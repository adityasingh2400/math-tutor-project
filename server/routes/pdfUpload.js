const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { spawn } = require('child_process');

// 1) Setup Multer for PDF file storage:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store PDFs in a local uploads/ folder
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 2) Define the route:
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // The path to the newly uploaded PDF
    const pdfPath = req.file.path;  // e.g. "server/uploads/1673645588723.pdf"
    const parseScriptPath = path.join(__dirname, '../../pdfparsing/parse_pdf.py');

    // Build config object for advanced partition_file usage:
    const parseConfig = {
      chunking_options: {},         // enable default chunking
      use_ocr: true,
      threshold: 0.35,
      extract_table_structure: true,
      // aryn_api_key: process.env.ARYN_API_KEY  // optional explicit key
    };

    // 3) Spawn python process:
    const pythonProcess = spawn('python', [
      parseScriptPath,
      pdfPath,
      JSON.stringify(parseConfig)
    ]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', chunk => {
      stdoutData += chunk;
    });

    pythonProcess.stderr.on('data', chunk => {
      stderrData += chunk;
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process error code:', code, stderrData);
        return res.status(500).json({ error: 'Failed to parse PDF', details: stderrData });
      }

      try {
        const parsed = JSON.parse(stdoutData);
        if (parsed.error) {
          return res.status(500).json({ error: parsed.error });
        }

        // Optionally save to DB or do advanced processing:
        // e.g., db.ParsedDocuments.create({ pdfPath, parsedJSON: JSON.stringify(parsed) })

        // Send back the parsed data
        res.status(200).json({
          message: 'PDF parsed successfully!',
          data: parsed
        });
      } catch (err) {
        console.error('Error parsing stdout JSON:', err);
        res.status(500).json({ error: 'Invalid JSON output from python' });
      }
    });
  } catch (err) {
    console.error('Error in /upload route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
