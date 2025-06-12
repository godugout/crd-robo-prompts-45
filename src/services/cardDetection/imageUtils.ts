
export const resizeImage = async (img: HTMLImageElement, maxDimension: number): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Calculate new dimensions while maintaining aspect ratio
  const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;

  // Draw resized image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image
  return new Promise((resolve, reject) => {
    const resizedImg = new Image();
    resizedImg.onload = () => resolve(resizedImg);
    resizedImg.onerror = reject;
    resizedImg.src = canvas.toDataURL();
  });
};
