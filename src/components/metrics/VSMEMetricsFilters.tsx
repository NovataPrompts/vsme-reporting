
import React from "react";
import { Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VSMEMetric } from "@/types/vsmeMetrics";

interface VSMEMetricsFiltersProps {
  metrics: VSMEMetric[];
  selectedTopic: string;
  selectedSection: string;
  selectedSubSection: string;
  selectedInputType: string;
  onTopicChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  onSubSectionChange: (value: string) => void;
  onInputTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const VSMEMetricsFilters = ({
  metrics,
  selectedTopic,
  selectedSection,
  selectedSubSection,
  selectedInputType,
  onTopicChange,
  onSectionChange,
  onSubSectionChange,
  onInputTypeChange,
  onClearFilters,
}: VSMEMetricsFiltersProps) => {
  // Get unique values for each filter
  const topics = Array.from(new Set(
    metrics
      .map(metric => metric.topic)
      .filter((topic): topic is string => Boolean(topic && topic.trim() !== ''))
  )).sort();

  const sections = Array.from(new Set(
    metrics
      .map(metric => metric.section)
      .filter((section): section is string => Boolean(section && section.trim() !== ''))
  )).sort();

  const subSections = Array.from(new Set(
    metrics
      .map(metric => metric.subSection)
      .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
  )).sort();

  const inputTypes = Array.from(new Set(
    metrics
      .map(metric => metric.inputType)
      .filter((inputType): inputType is string => Boolean(inputType && inputType.trim() !== ''))
  )).sort();

  const hasActiveFilters = selectedTopic && selectedTopic !== "all" || 
                          selectedSection && selectedSection !== "all" || 
                          selectedSubSection && selectedSubSection !== "all" || 
                          selectedInputType && selectedInputType !== "all";

  const handleTopicChange = (value: string) => {
    onTopicChange(value === "all" ? "" : value);
  };

  const handleSectionChange = (value: string) => {
    onSectionChange(value === "all" ? "" : value);
  };

  const handleSubSectionChange = (value: string) => {
    onSubSectionChange(value === "all" ? "" : value);
  };

  const handleInputTypeChange = (value: string) => {
    onInputTypeChange(value === "all" ? "" : value);
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Topic</label>
          <Select value={selectedTopic || "all"} onValueChange={handleTopicChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>
                  {topic.replace("Enviornment", "Environment")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Section</label>
          <Select value={selectedSection || "all"} onValueChange={handleSectionChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {sections.map(section => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Sub-Section</label>
          <Select value={selectedSubSection || "all"} onValueChange={handleSubSectionChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All sub-sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sub-sections</SelectItem>
              {subSections.map(subSection => (
                <SelectItem key={subSection} value={subSection}>
                  {subSection}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Input Type</label>
          <Select value={selectedInputType || "all"} onValueChange={handleInputTypeChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {inputTypes.map(inputType => (
                <SelectItem key={inputType} value={inputType}>
                  {inputType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTopic && selectedTopic !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Topic: {selectedTopic.replace("Enviornment", "Environment")}
              <button
                onClick={() => onTopicChange("")}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSection && selectedSection !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Section: {selectedSection}
              <button
                onClick={() => onSectionChange("")}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSubSection && selectedSubSection !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Sub-Section: {selectedSubSection}
              <button
                onClick={() => onSubSectionChange("")}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedInputType && selectedInputType !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Type: {selectedInputType}
              <button
                onClick={() => onInputTypeChange("")}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
