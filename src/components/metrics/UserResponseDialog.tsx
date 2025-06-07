
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVSMEDatabase } from "@/hooks/useVSMEDatabase";
import { VSMEMetric } from "@/types/vsmeMetrics";

interface UserResponseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  metric: VSMEMetric | null;
  metricId: string | null;
}

export const UserResponseDialog = ({
  isOpen,
  onClose,
  metric,
  metricId
}: UserResponseDialogProps) => {
  const { getUserResponse, saveUserResponse } = useVSMEDatabase();
  const [response, setResponse] = useState<any>(null);
  const [responseValue, setResponseValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && metricId) {
      loadResponse();
    }
  }, [isOpen, metricId]);

  const loadResponse = async () => {
    if (!metricId) return;
    
    setIsLoading(true);
    const data = await getUserResponse(metricId);
    setResponse(data);
    setResponseValue(data?.response_value || "");
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!metricId) return;
    
    const success = await saveUserResponse(metricId, responseValue);
    if (success) {
      setIsEditing(false);
      loadResponse();
    }
  };

  const renderResponseData = () => {
    if (!response?.response_data) return null;

    // If it's tabular data (array of objects)
    if (Array.isArray(response.response_data)) {
      return (
        <div className="mt-4">
          <Label className="text-sm font-medium">Tabular Data:</Label>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border border-gray-200 rounded">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(response.response_data[0] || {}).map((key) => (
                    <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {response.response_data.map((row: any, index: number) => (
                  <tr key={index} className="border-b">
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <td key={cellIndex} className="px-3 py-2 text-sm text-gray-900">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // For other JSON data
    return (
      <div className="mt-4">
        <Label className="text-sm font-medium">Additional Data:</Label>
        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
          {JSON.stringify(response.response_data, null, 2)}
        </pre>
      </div>
    );
  };

  const isTabularMetric = metric?.inputType?.toLowerCase() === 'tabular';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Response for {metric?.reference}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {metric && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{metric.metric}</h3>
              <p className="text-sm text-gray-600 mt-1">{metric.question}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">Loading response...</div>
          ) : response ? (
            <div className="space-y-4">
              {!isTabularMetric && (
                <div>
                  <Label htmlFor="response-value" className="text-sm font-medium">
                    Response Value:
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="response-value"
                      value={responseValue}
                      onChange={(e) => setResponseValue(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded border">
                      {responseValue || "No response value"}
                    </div>
                  )}
                </div>
              )}

              {renderResponseData()}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  !isTabularMetric && (
                    <Button onClick={() => setIsEditing(true)}>Edit Response</Button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No response found for this metric.</p>
              {!isTabularMetric && (
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setIsEditing(true);
                    setResponseValue("");
                  }}
                >
                  Add Response
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
