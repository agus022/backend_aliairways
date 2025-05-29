
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

// Multer middleware setup
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: process.env.AWS_REGION, // o la que sea tu región
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, // ← importante aquí
  },
});
// Middleware handler for Next.js
export const config = {
  api: {
    bodyParser: false, // necesario para usar multer
  },
};

// Función para parsear con multer en Next.js sin nextConnect
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export const imageBucket = async (req, res) => {
  console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
  console.log("Secret:", process.env.AWS_SECRET_ACCESS_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await runMiddleware(req, res, upload.single("image"));

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se proporcionó ninguna imagen" });
    }

    const userId = req.body.userId || "abc123"; // Idealmente lo tomas del token de sesión
    const filename = `${userId}/Aliairways.png`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,            
      ContentType: file.mimetype    
      
    });

    await s3.send(command);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error al subir la imagen a S3:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};
