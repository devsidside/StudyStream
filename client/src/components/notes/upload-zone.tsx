import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileText, Image, Archive, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/utils/utils";

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  id?: string;
}

interface UploadZoneProps {
  files: FileWithPreview[];
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  className?: string;
  isUploading?: boolean;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/zip': ['.zip'],
};

export default function UploadZone({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSizePerFile = 50 * 1024 * 1024, // 50MB
  className,
  isUploading = false,
}: UploadZoneProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      // Clean up all tracked object URLs when component unmounts
      objectUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      objectUrlsRef.current.clear();
    };
  }, []);

  // Generate unique ID for files
  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Check for duplicate files
  const isDuplicateFile = (newFile: File, existingFiles: FileWithPreview[]): boolean => {
    return existingFiles.some(file => 
      file.name === newFile.name && 
      file.size === newFile.size && 
      file.lastModified === newFile.lastModified
    );
  };

  // Validate file health (check if file is corrupted)
  const validateFileHealth = async (file: File): Promise<boolean> => {
    try {
      if (file.type.startsWith('image/')) {
        return new Promise((resolve) => {
          const img = document.createElement('img');
          const objectUrl = URL.createObjectURL(file);
          
          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(true);
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(false);
          };
          img.src = objectUrl;
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  // Compress image files (optional optimization)
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.size < 1024 * 1024) { // Don't compress files under 1MB
      return file;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      // Check if canvas context is available
      if (!ctx) {
        return file; // Return original file if canvas context is not available
      }
      
      return new Promise((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        
        const cleanup = () => {
          URL.revokeObjectURL(objectUrl);
        };
        
        img.onload = () => {
          try {
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              cleanup();
              if (blob && blob.size < file.size) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                resolve(file); // Return original if compression didn't help
              }
            }, file.type, 0.8);
          } catch (error) {
            cleanup();
            resolve(file); // Return original file on any error
          }
        };
        
        img.onerror = () => {
          cleanup();
          resolve(file); // Return original file on error
        };
        
        img.src = objectUrl;
      });
    } catch {
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    
    // Handle rejected files with better error messages
    rejectedFiles.forEach((fileRejection) => {
      fileRejection.errors.forEach((error: any) => {
        switch (error.code) {
          case 'file-too-large':
            newErrors.push(`📁 "${fileRejection.file.name}" is too large. Maximum size is ${formatFileSize(maxSizePerFile)}.`);
            break;
          case 'file-invalid-type':
            newErrors.push(`🚫 "${fileRejection.file.name}" format is not supported. Please use PDF, DOC, DOCX, PPT, PPTX, TXT, MD, PNG, JPG, or ZIP files.`);
            break;
          case 'too-many-files':
            newErrors.push(`📂 Too many files selected. Maximum ${maxFiles} files allowed.`);
            break;
          default:
            newErrors.push(`❌ Error with "${fileRejection.file.name}": ${error.message}`);
        }
      });
    });

    // Check total file count
    if (files.length + acceptedFiles.length > maxFiles) {
      newErrors.push(`📂 Maximum ${maxFiles} files allowed. You currently have ${files.length} files.`);
      setErrors(newErrors);
      return;
    }

    // Process files with enhanced validation
    const processedFiles: FileWithPreview[] = [];
    
    for (const file of acceptedFiles) {
      // Check for duplicates
      if (isDuplicateFile(file, files)) {
        newErrors.push(`🔄 "${file.name}" is already selected.`);
        continue;
      }

      // Validate file health
      const isHealthy = await validateFileHealth(file);
      if (!isHealthy) {
        newErrors.push(`💔 "${file.name}" appears to be corrupted. Please select a different file.`);
        continue;
      }

      // Compress image if needed
      const processedFile = await compressImage(file);
      
      // Create preview URL and track it for cleanup
      let previewUrl: string | undefined;
      if (processedFile.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(processedFile);
        objectUrlsRef.current.add(previewUrl);
      }
      
      const fileWithMetadata = Object.assign(processedFile, {
        id: generateFileId(),
        preview: previewUrl,
        uploadProgress: 0,
        uploadStatus: 'pending' as const,
      }) as FileWithPreview;

      processedFiles.push(fileWithMetadata);
    }

    const updatedFiles = [...files, ...processedFiles];
    onFilesChange(updatedFiles);
    setErrors(newErrors);
  }, [files, maxFiles, maxSizePerFile, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: maxSizePerFile,
    multiple: true,
  });


  const removeFile = (indexToRemove: number) => {
    const fileToRemove = files[indexToRemove];
    
    // Clean up preview URL if it exists
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
      objectUrlsRef.current.delete(fileToRemove.preview);
    }
    
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (file.type.includes('image')) return <Image className="w-5 h-5 text-green-500" />;
    if (file.type.includes('zip')) return <Archive className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer",
          isDragActive && "drag-over"
        )}
        data-testid="upload-zone"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-muted-foreground">or</p>
            <Button 
              variant="outline" 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              data-testid="button-browse-files"
            >
              Browse Files
            </Button>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, MD, PNG, JPG, ZIP (Max 50MB each)
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-destructive" data-testid={`error-message-${index}`}>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Selected Files ({files.length}):</h4>
            <div className="text-xs text-muted-foreground">
              Total: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
            </div>
          </div>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={file.id || `${file.name}-${index}`}
                className={cn(
                  "file-preview p-3 rounded-lg border transition-all duration-200",
                  file.uploadStatus === 'success' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
                  file.uploadStatus === 'error' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
                  file.uploadStatus === 'uploading' && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
                  file.uploadStatus === 'pending' && "border-border bg-card"
                )}
                data-testid={`file-preview-${index}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {file.uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {file.uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {file.uploadStatus === 'uploading' && (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.uploadStatus === 'pending' && getFileIcon(file)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        {file.uploadStatus === 'uploading' && (
                          <span className="text-xs text-blue-600 font-medium">
                            {file.uploadProgress}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.uploadStatus === 'success' && (
                          <span className="text-xs text-green-600">✓ Uploaded</span>
                        )}
                        {file.uploadStatus === 'error' && (
                          <span className="text-xs text-red-600">✗ Failed</span>
                        )}
                        {file.uploadStatus === 'uploading' && (
                          <span className="text-xs text-blue-600">Uploading...</span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {file.uploadStatus === 'uploading' && typeof file.uploadProgress === 'number' && (
                        <div className="mt-2">
                          <Progress value={file.uploadProgress} className="h-1" />
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {file.uploadStatus === 'error' && file.uploadError && (
                        <p className="text-xs text-red-600 mt-1">{file.uploadError}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                    disabled={file.uploadStatus === 'uploading'}
                    data-testid={`button-remove-file-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Upload Statistics */}
          {isUploading && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300">
                  Uploading {files.filter(f => f.uploadStatus === 'uploading').length} of {files.length} files...
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {Math.round(files.reduce((acc, file) => acc + (file.uploadProgress || 0), 0) / files.length)}% total
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
