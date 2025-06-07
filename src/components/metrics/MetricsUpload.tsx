
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useVSMEDatabase } from "@/hooks/useVSMEDatabase";
import * as XLSX from 'xlsx';

export const MetricsUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveUserResponse } = useVSMEDatabase();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

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

  const processExcelFile = async (file: File) => {
    return new Promise<number>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          console.log('Available sheets:', workbook.SheetNames);
          
          // Process main sheet (usually the first one or one with "ESG" in name)
          const mainSheetName = workbook.SheetNames.find(name => 
            name.toLowerCase().includes('esg') || 
            name.toLowerCase().includes('report') ||
            name.toLowerCase().includes('vsme') ||
            name.toLowerCase().includes('basic')
          ) || workbook.SheetNames[0];
          
          console.log('Processing sheet:', mainSheetName);
          
          const mainSheet = workbook.Sheets[mainSheetName];
          const mainData = XLSX.utils.sheet_to_json(mainSheet, { header: 1 });
          
          console.log('Main sheet data rows:', mainData.length);
          console.log('First 5 rows:', mainData.slice(0, 5));
          
          // Process each row in the main sheet
          let savedCount = 0;
          let errorCount = 0;
          const totalRows = mainData.length;
          
          // Find header row and column indices - be more flexible with column names
          let headerRowIndex = -1;
          let novataRefIndex = -1;
          let responseIndex = -1;
          
          // Look through first 10 rows to find headers
          for (let i = 0; i < Math.min(10, totalRows); i++) {
            const row = mainData[i] as any[];
            if (!row) continue;
            
            console.log(`Checking row ${i}:`, row);
            
            for (let j = 0; j < row.length; j++) {
              const cellValue = String(row[j] || '').toLowerCase().trim();
              console.log(`  Column ${j}: "${cellValue}"`);
              
              // More flexible matching for Novata Reference column
              if ((cellValue.includes('novata') && cellValue.includes('ref')) ||
                  cellValue === 'novata reference' ||
                  cellValue === 'novata_reference' ||
                  cellValue === 'reference') {
                headerRowIndex = i;
                novataRefIndex = j;
                console.log(`Found Novata Reference column at row ${i}, col ${j}`);
              }
              
              // More flexible matching for Response column
              if (cellValue === 'response' || 
                  cellValue === 'answer' || 
                  cellValue === 'value' ||
                  cellValue.includes('response')) {
                responseIndex = j;
                console.log(`Found Response column at row ${i}, col ${j}`);
              }
            }
            
            // If we found both columns in this row, we're done
            if (novataRefIndex !== -1 && responseIndex !== -1) {
              break;
            }
          }
          
          console.log('Header analysis complete:');
          console.log('Header found at row:', headerRowIndex);
          console.log('Novata Reference column:', novataRefIndex);
          console.log('Response column:', responseIndex);
          
          if (novataRefIndex === -1) {
            throw new Error('Could not find Novata Reference column. Expected column names: "Novata Reference", "novata_reference", or "reference"');
          }
          
          if (responseIndex === -1) {
            throw new Error('Could not find Response column. Expected column names: "Response", "answer", or "value"');
          }
          
          // Process data rows starting after the header
          const startRow = Math.max(headerRowIndex + 1, 0);
          console.log(`Processing data starting from row ${startRow}`);
          
          for (let i = startRow; i < totalRows; i++) {
            const row = mainData[i] as any[];
            if (!row || row.length === 0) continue;
            
            const reference = row[novataRefIndex];
            const response = row[responseIndex];
            
            console.log(`Processing row ${i}: Reference="${reference}", Response="${response}"`);
            
            // Skip rows without a reference
            if (!reference || String(reference).trim() === '') {
              console.log(`Skipping row ${i}: no reference`);
              continue;
            }
            
            // Skip empty responses unless they're explicitly empty strings or 0
            if (response === undefined || response === null || String(response).trim() === '') {
              console.log(`Skipping row ${i}: empty response`);
              continue;
            }
            
            // Check if this is a tabular data reference
            const responseStr = String(response);
            if (responseStr.toLowerCase().includes('tabular data')) {
              // Look for corresponding tabular data sheet
              const referenceStr = String(reference);
              const tabularSheetName = workbook.SheetNames.find(name => 
                name.includes(referenceStr) || name === referenceStr
              );
              
              if (tabularSheetName) {
                console.log(`Found tabular sheet for ${referenceStr}: ${tabularSheetName}`);
                const tabularSheet = workbook.Sheets[tabularSheetName];
                const tabularData = XLSX.utils.sheet_to_json(tabularSheet);
                
                // Save with tabular data
                const success = await saveUserResponse(
                  referenceStr, 
                  'Tabular data provided', 
                  tabularData
                );
                
                if (success) {
                  savedCount++;
                  console.log(`Saved tabular data for ${referenceStr}`);
                } else {
                  errorCount++;
                  console.error(`Failed to save tabular data for ${referenceStr}`);
                }
              } else {
                console.warn(`No tabular sheet found for reference: ${referenceStr}`);
                // Save the text response as is
                const success = await saveUserResponse(String(reference), responseStr);
                if (success) {
                  savedCount++;
                  console.log(`Saved text response for ${referenceStr}`);
                } else {
                  errorCount++;
                  console.error(`Failed to save text response for ${referenceStr}`);
                }
              }
            } else {
              // Regular text/number response
              const success = await saveUserResponse(String(reference), responseStr);
              if (success) {
                savedCount++;
                console.log(`Saved response for ${reference}: ${response}`);
              } else {
                errorCount++;
                console.error(`Failed to save response for ${reference}: ${response}`);
              }
            }
            
            // Update progress
            const progress = Math.round(((i - startRow + 1) / (totalRows - startRow)) * 100);
            setUploadProgress(progress);
          }
          
          console.log(`Processing complete. Saved ${savedCount} responses out of ${totalRows - startRow} rows processed. ${errorCount} errors encountered.`);
          setProcessedCount(savedCount);
          
          // Only show error toast if there were significant errors and no successes
          if (savedCount === 0 && errorCount > 0) {
            console.error('No responses were saved due to database errors');
          }
          
          resolve(savedCount);
          
        } catch (error) {
          console.error('Error processing Excel file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setProcessedCount(0);
    
    // Check if file is Excel format
    if (!(file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadStatus('error');
      toast({
        title: "Invalid file format",
        description: "Please upload an Excel file (.xlsx or .xls).",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      const savedCount = await processExcelFile(file);
      
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Only show success toast if responses were actually saved
      if (savedCount > 0) {
        toast({
          title: "Upload successful",
          description: `${file.name} has been processed successfully. ${savedCount} responses were saved.`,
          duration: 3000,
        });
        
        // Update local storage to indicate metrics were updated
        localStorage.setItem('metricsLastUpdated', new Date().toISOString());
      } else {
        // Show warning toast if no responses were saved
        toast({
          title: "No responses saved",
          description: `${file.name} was processed but no responses were saved. Please check the file format and column names.`,
          variant: "destructive",
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus('error');
      toast({
        title: "Processing failed",
        description: `There was an error processing your Excel file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format and try again.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const continueToMetrics = () => {
    navigate("/metrics");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upload Excel Responses</CardTitle>
        <CardDescription>
          Upload your Excel file with metric responses. The main sheet should contain responses, with separate tabs for tabular data referenced by metric numbers.
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
              <h3 className="text-lg font-medium mb-2">Drag and drop your Excel file with responses</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Main sheet with responses + separate tabs for tabular data (Excel .xlsx or .xls)
              </p>
              <div className="relative">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
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
                Reading Excel file and saving responses to database...
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
              <h3 className="text-lg font-medium mb-2">Excel File Processed Successfully!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {fileName} has been processed and {processedCount} responses were saved to the database.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setUploadStatus('idle');
                    setFileName(null);
                    setUploadProgress(0);
                    setProcessedCount(0);
                  }}
                >
                  Upload Another File
                </Button>
                <Button 
                  className="bg-[#057cc1] hover:bg-[#057cc1]/90 text-white"
                  onClick={continueToMetrics}
                >
                  View Responses
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Failed</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please make sure you're uploading a valid Excel file (.xlsx or .xls) with the correct format.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setUploadStatus('idle');
                  setFileName(null);
                  setUploadProgress(0);
                  setProcessedCount(0);
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
