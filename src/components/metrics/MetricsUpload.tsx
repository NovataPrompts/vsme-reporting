
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export const MetricsUpload = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload process with progress updates
    const totalDuration = 1500; // Total duration in milliseconds
    const intervalTime = 100; // Update progress every 100ms
    const totalSteps = totalDuration / intervalTime;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / totalSteps) * 100), 95);
      setUploadProgress(newProgress);
      
      if (currentStep >= totalSteps) {
        clearInterval(progressInterval);
        
        // Complete the upload
        setTimeout(() => {
          setUploadProgress(100);
          if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.json')) {
            setUploadStatus('success');
            toast({
              title: "Upload successful",
              description: `${file.name} has been uploaded successfully.`,
              duration: 3000,
            });
          } else {
            setUploadStatus('error');
            toast({
              title: "Upload failed",
              description: "Please upload a CSV, Excel, or JSON file.",
              variant: "destructive",
              duration: 3000,
            });
          }
        }, 200);
      }
    }, intervalTime);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upload Metrics Data</CardTitle>
        <CardDescription>
          Upload your sustainability metrics data to automatically generate compliant reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging 
              ? "border-accent bg-accent/5" 
              : uploadStatus === 'error'
                ? "border-red-300 bg-red-50 dark:bg-red-900/10" 
                : uploadStatus === 'success'
                  ? "border-green-300 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-300 dark:border-gray-700"
          } transition-all-ease`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadStatus === 'idle' && (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supported formats: CSV, Excel, or JSON
              </p>
              <div className="relative">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.json"
                />
                <Button className="bg-accent hover:bg-accent/90 text-primary">
                  Browse Files
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Uploading {fileName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please wait while we process your file...
              </p>
              <div className="w-full max-w-md mb-2">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {uploadProgress}% Complete
              </p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {fileName} has been uploaded successfully.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setUploadStatus('idle');
                  setFileName(null);
                  setUploadProgress(0);
                }}
              >
                Upload Another File
              </Button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Failed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please make sure you're uploading a CSV, Excel, or JSON file.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setUploadStatus('idle');
                  setFileName(null);
                  setUploadProgress(0);
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
