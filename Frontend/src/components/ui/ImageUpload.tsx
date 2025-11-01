import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  multiple?: boolean;
  maxFiles?: number;
}

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

const ImageUpload = ({ 
  onImagesChange, 
  initialImages = [], 
  multiple = true, 
  maxFiles = 5 
}: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return;

    const fileArray = Array.from(files);
    
    // Check file count limit
    if (multiple && images.length + fileArray.length > maxFiles) {
      alert(`Maksimum ${maxFiles} dosya yükleyebilirsiniz`);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      alert('Sadece bir dosya yükleyebilirsiniz');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Sadece JPEG, JPG ve PNG dosyaları yükleyebilirsiniz');
      return;
    }

    // Check file sizes (5MB limit)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        fileArray.forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append('image', fileArray[0]);
      }

      const endpoint = multiple ? '/api/admin/upload/multiple' : '/api/admin/upload/single';
      
      console.log('Upload token:', token); // Debug için
      
      if (!token) {
        alert('Giriş yapmanız gerekiyor');
        return;
      }
      
      const response = await axios.post(`http://localhost:5004${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        let newImageUrls: string[];
        
        if (multiple) {
          const uploadedFiles: UploadedFile[] = response.data.data;
          newImageUrls = uploadedFiles.map(file => file.url);
        } else {
          const uploadedFile: UploadedFile = response.data.data;
          newImageUrls = [uploadedFile.url];
        }

        const updatedImages = multiple ? [...images, ...newImageUrls] : newImageUrls;
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const filename = imageUrl.split('/').pop();
      
      await axios.delete(`http://localhost:5004/api/admin/upload/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedImages = images.filter(img => img !== imageUrl);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Dosya silinirken hata oluştu');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/jpeg,image/jpg,image/png"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Yükleniyor...</span>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 mb-2">
              Dosyaları buraya sürükleyin veya tıklayın
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG (Maks. 5MB)
              {multiple && ` - Maksimum ${maxFiles} dosya`}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={`http://localhost:5004${imageUrl}`}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(imageUrl);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        {multiple ? (
          <p>{images.length} / {maxFiles} dosya yüklendi</p>
        ) : (
          images.length > 0 && <p>1 dosya yüklendi</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;