import { storage } from './firebase-config';
import { ref, getDownloadURL } from "firebase/storage";

export const fetchImageUrls = async (imagePaths) => {
  try {
    return await Promise.all(
      imagePaths.map(async (path) => {
        const storageRef = ref(storage, path);
        return await getDownloadURL(storageRef);
      })
    );
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    return [];
  }
};

export const fetchVideoUrl = async (videoPath) => {
  if (!videoPath) return null;
  try {
    const storageRef = ref(storage, videoPath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error fetching video URL:", error);
    return null;
  }
};