import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "products",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url as string);
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};
