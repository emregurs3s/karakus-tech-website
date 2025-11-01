/**
 * Resim URL'sini düzenler. Eğer relative path ise olduğu gibi döner.
 * @param imageUrl - Resim URL'si
 * @returns Düzenlenmiş URL
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // Eğer zaten tam URL ise olduğu gibi dön
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Relative path ise olduğu gibi dön (artık aynı domain'de çalışacağız)
  return imageUrl;
};

/**
 * Varsayılan placeholder resim
 */
export const getPlaceholderImage = (width = 400, height = 400): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" font-size="18" text-anchor="middle" dy=".3em" fill="#999">
        Resim Yok
      </text>
    </svg>
  `)}`;
};