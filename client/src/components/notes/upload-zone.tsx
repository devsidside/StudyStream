import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText, Image, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

interface UploadZoneProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  className?: string;
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
  onFilesChange,
  maxFiles = 10,
  maxSizePerFile = 50 * 1024 * 1024, // 50MB
  className,
}: UploadZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    
    // Handle rejected files
    rejectedFiles.forEach((fileRejection) => {
      fileRejection.errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`File ${fileRejection.file.name} is too large. Max size is 50MB.`);
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`File ${fileRejection.file.name} has unsupported format.`);
        } else {
          newErrors.push(`Error with ${fileRejection.file.name}: ${error.message}`);
        }
      });
    });

    // Check total file count
    if (files.length + acceptedFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed.`);
      setErrors(newErrors);
      return;
    }

    const newFiles = acceptedFiles.map((file) => 
      Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }) as FileWithPreview
    );

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setErrors(newErrors);
  }, [files, maxFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: maxSizePerFile,
    multiple: true,
  });

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
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
            <Button variant="outline" type="button" data-testid="button-browse-files">
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
          <h4 className="font-medium">Selected Files ({files.length}):</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="file-preview flex items-center justify-between p-3 rounded-lg"
                data-testid={`file-preview-${index}`}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                  data-testid={`button-remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
