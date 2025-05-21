
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { VSMEMetric } from "@/types/vsmeMetrics";

export const MetricsUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedMetrics, setProcessedMetrics] = useState<VSMEMetric[]>([]);

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
    
    // Check if file is a valid type
    if (!(file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.json'))) {
      setUploadStatus('error');
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV, Excel, or JSON file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
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
        
        // Complete the upload and process the file
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            setTimeout(() => {
              setUploadProgress(100);
              setUploadStatus('success');
              toast({
                title: "Upload successful",
                description: `${file.name} has been processed successfully. Metrics data has been updated.`,
                duration: 3000,
              });
              
              // In a real implementation, we would parse the file and update the metrics here
              // For this simulation, we'll just assume success
              console.log("File content:", e.target?.result);
              
              // Update local storage to indicate metrics were updated
              localStorage.setItem('metricsLastUpdated', new Date().toISOString());
            }, 200);
          } catch (error) {
            console.error("Error processing file:", error);
            setUploadStatus('error');
            toast({
              title: "Processing failed",
              description: "There was an error processing your file. Please check the format and try again.",
              variant: "destructive",
              duration: 3000,
            });
          }
        };
        
        reader.onerror = () => {
          setUploadStatus('error');
          toast({
            title: "Upload failed",
            description: "There was an error reading your file. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        };
        
        if (file.name.endsWith('.json')) {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      }
    }, intervalTime);
  };

  const continueToMetrics = () => {
    navigate("/metrics");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upload Updated Metrics Data</CardTitle>
        <CardDescription>
          Upload your updated sustainability metrics spreadsheet to automatically update your VSME metrics data.
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
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your updated metrics spreadsheet</h3>
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
                <Button className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white">
                  Browse Files
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Processing {fileName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please wait while we update your metrics data...
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
              <h3 className="text-lg font-medium mb-2">Metrics Data Updated!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {fileName} has been processed and your VSME metrics have been updated.
              </p>
              <div className="flex gap-3">
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
                <Button 
                  className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white"
                  onClick={continueToMetrics}
                >
                  View Updated Metrics
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Failed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please make sure you're uploading a valid CSV, Excel, or JSON file with the correct format.
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
