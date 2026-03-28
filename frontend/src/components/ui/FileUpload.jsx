import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const FileUpload = ({ onFileSelect, accept = "image/*", maxSize = 5242880, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError('');
    if (!file) return;
    
    if (file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`);
      return;
    }
    
    if (!file.type.match(accept.replace('*', '.*'))) {
      setError('Invalid file type');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="relative rounded-xl border border-white/20 bg-black/40 p-2 overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg opacity-80" />
          <button 
            type="button"
            onClick={clearFile}
            className="absolute top-4 right-4 bg-red-500/80 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 flex items-center border border-white/10">
            <File className="w-5 h-5 text-gold mr-3" />
            <span className="text-sm font-medium text-offwhite truncate">Proof_Screenshot.png</span>
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
            dragActive ? "border-gold bg-gold/5 scale-[1.02]" : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10",
            error ? "border-red-500/50 bg-red-500/5" : ""
          )}
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={handleChange}
          />
          <UploadCloud className={cn("w-10 h-10 mb-4 transition-colors", dragActive ? "text-gold" : "text-white/40")} />
          <p className="text-sm text-offwhite font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-white/40 uppercase tracking-widest">SVG, PNG, JPG (Max. 5MB)</p>
          {error && <p className="text-xs text-red-400 mt-4 absolute bottom-4 bg-red-400/10 px-3 py-1 rounded-full">{error}</p>}
        </div>
      )}
    </div>
  );
};
