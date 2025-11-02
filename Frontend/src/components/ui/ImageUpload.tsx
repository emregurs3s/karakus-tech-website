import { useState, useEffect } from 'react';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  multiple?: boolean;
  maxFiles?: number;
}

const ImageUpload = ({ 
  onImagesChange, 
  initialImages = [], 
  multiple = false, 
  maxFiles = 5 
}: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  // URL validation - more flexible for GitHub raw URLs
  const validateImageUrl = (url: string) => {
    // Check if it's a valid HTTP/HTTPS URL
    const isValidHttpUrl = url.startsWith('http://') || url.startsWith('https://');
    
    if (!isValidHttpUrl) return false;
    
    // Check for image extensions (more flexible)
    const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
    
    // Special case for GitHub raw URLs - they might not have extensions in the URL
    const isGitHubRaw = url.includes('raw.githubusercontent.com') || url.includes('github.com') && url.includes('/raw/');
    
    // If it's a GitHub raw URL, be more lenient
    if (isGitHubRaw) {
      return true;
    }
    
    // For other URLs, check for image extensions
    return imageUrlPattern.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewImageUrl(url);
    setIsValidUrl(validateImageUrl(url));
  };

  const addImageUrl = () => {
    if (!isValidUrl || !newImageUrl.trim()) return;
    
    if (multiple) {
      if (images.length >= maxFiles) {
        alert(`Maksimum ${maxFiles} resim ekleyebilirsiniz`);
        return;
      }
      setImages(prev => [...prev, newImageUrl.trim()]);
    } else {
      setImages([newImageUrl.trim()]);
    }
    
    setNewImageUrl('');
    setIsValidUrl(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageUrl();
    }
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {multiple ? 'Resim URL\'leri Ekle' : 'Resim URL\'si'}
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            placeholder="https://github.com/emregurs3s/karakus-images/raw/main/..."
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              newImageUrl && !isValidUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={addImageUrl}
            disabled={!isValidUrl}
            className={`px-4 py-2 rounded-md font-medium ${
              isValidUrl
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Ekle
          </button>
        </div>
        {newImageUrl && !isValidUrl && (
          <p className="text-sm text-red-600">
            Geçerli bir resim URL'si girin (.jpg, .jpeg, .png, .gif, .webp)
          </p>
        )}
        <p className="text-xs text-gray-500">
          GitHub repository'nizden resim URL'si: 
          <br />
          <code className="bg-gray-100 px-1 rounded">
            https://github.com/emregurs3s/karakus-images/raw/main/categories/resim.jpg
          </code>
        </p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {multiple ? 'Seçili Resimler' : 'Seçili Resim'}
          </label>
          <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '100%', position: 'relative', minHeight: '200px' }}>
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    width="400"
                    height="400"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Try to show a placeholder or error state
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-placeholder')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-placeholder flex items-center justify-center absolute inset-0 w-full h-full bg-gray-200 text-gray-500 text-sm';
                        errorDiv.innerHTML = '❌<br/>Resim yüklenemedi';
                        parent.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {imageUrl}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Repository Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <p className="text-blue-800 font-medium">GitHub Repository Kullanımı</p>
            <p className="text-blue-700 mt-1">
              Resimlerinizi{' '}
              <a 
                href="https://github.com/emregurs3s/karakus-images" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                karakus-images repository
              </a>
              'sine yükleyin ve "Raw" URL'sini kullanın.
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Örnek: categories/, products/ klasörlerini kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;