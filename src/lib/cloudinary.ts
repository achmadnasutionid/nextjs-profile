import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function uploadImage(
  buffer: Buffer,
  folder: string,
): Promise<{ publicId: string; url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ publicId: result.public_id, url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}

// Non-image files (PDFs, etc). The original filename (with extension) is kept
// in the public_id so the delivered URL ends in the right extension.
export function uploadFile(
  buffer: Buffer,
  folder: string,
  filename: string,
): Promise<{ publicId: string; url: string }> {
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const publicId = `${folder}/${Date.now()}-${safeName}`;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: "raw" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ publicId: result.public_id, url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}
