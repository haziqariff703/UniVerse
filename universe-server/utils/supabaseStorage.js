const supabase = require('../config/supabase');
const path = require('path');

// Single bucket with folders inside
const BUCKET_NAME = 'pdf-files';
const IMAGE_FOLDER = 'images';
const DOCUMENT_FOLDER = 'documents';

function resolveFolderFromMimeType(mimetype) {
  if (typeof mimetype !== 'string') return null;
  if (mimetype.startsWith('image/')) return IMAGE_FOLDER;
  if (mimetype === 'application/pdf') return DOCUMENT_FOLDER;
  return null;
}

class SupabaseStorage {
  constructor(opts = {}) {
    this.bucket = opts.bucket || BUCKET_NAME;
  }

  async _handleFile(req, file, cb) {
    if (!supabase) {
      const err = new Error('Supabase client not initialized');
      err.statusCode = 500;
      return cb(err);
    }

    let handled = false;
    const done = (err, data) => {
      if (handled) return;
      handled = true;
      cb(err, data);
    };

    const chunks = [];
    file.stream.on('data', (chunk) => chunks.push(chunk));

    file.stream.on('error', (err) => done(err));

    file.stream.on('end', async () => {
      try {
        const folder = resolveFolderFromMimeType(file.mimetype);
        if (!folder) {
          const err = new Error(
            'Unsupported file type. Only image/* and application/pdf are allowed.',
          );
          err.statusCode = 400;
          return done(err);
        }

        const buffer = Buffer.concat(chunks);
        const userId = req.user ? req.user.id : 'anonymous';
        const extension = path.extname(file.originalname || '');
        const fileName = `${userId}-${Date.now()}${extension}`;
        // Path structure: folder/fileName (e.g., images/userId-timestamp.png)
        const filePath = `${folder}/${fileName}`;

        console.log(`[Supabase Upload] Bucket: "${this.bucket}", Path: "${filePath}", ContentType: "${file.mimetype}"`);

        const { error: uploadError } = await supabase.storage
          .from(this.bucket)
          .upload(filePath, buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error(`[Supabase Upload Error] Bucket: "${this.bucket}", Error:`, uploadError.message);
          uploadError.statusCode = uploadError.statusCode || 502;
          return done(uploadError);
        }

        const {
          data: { publicUrl } = {},
        } = supabase.storage.from(this.bucket).getPublicUrl(filePath);

        if (!publicUrl) {
          const err = new Error('Failed to generate public URL for uploaded file.');
          err.statusCode = 500;
          return done(err);
        }

        done(null, {
          path: publicUrl,
          size: buffer.length,
          bucket: this.bucket,
          folder,
          filePath,
        });
      } catch (err) {
        done(err);
      }
    });
  }

  _removeFile(req, file, cb) {
    // Logic to delete file from Supabase if needed
    cb(null);
  }
}

module.exports = (opts) => new SupabaseStorage(opts);
