import React, { useState } from 'react';
import { uploadFile } from '../services/fileUploadService';
import Button from '../components/common/Button';

export default function TestUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setUrl('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const uploadedUrl = await uploadFile(file);
      setUrl(uploadedUrl);
      console.log('Uploaded URL:', uploadedUrl);
    } catch (err) {
      setError('Upload failed. Check console for details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Cloudinary Upload Test</h1>
      
      <div className="flex flex-col gap-2 w-full max-w-md">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      <Button onClick={handleUpload} loading={loading} disabled={!file}>
        Upload to Cloudinary
      </Button>

      {error && <p className="text-red-500">{error}</p>}
      
      {url && (
        <div className="mt-4 p-4 bg-green-50 rounded border border-green-200 text-center flex flex-col items-center gap-2">
          <p className="text-green-700 font-semibold">Upload Successful!</p>
          
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all text-sm">
            {url}
          </a>

          {file?.type.startsWith('image/') ? (
            <img src={url} alt="Uploaded" className="mt-4 max-h-60 rounded shadow" />
          ) : (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">File type: {file?.type}</p>
              {/* 
                  For PDFs, Cloudinary might return them as 'image' or 'raw' depending on settings.
                  We need to be careful not to break the URL structure.
                  The safest way is to insert fl_attachment after /upload/ 
              */}
              <a 
                href={url.includes('/upload/') ? url.replace('/upload/', '/upload/fl_attachment/') : url} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download File
              </a>
              <p className="text-xs text-gray-400 mt-1">
                (If download fails, right-click and "Save Link As")
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
