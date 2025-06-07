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
  // Custom sort function for topics
  const sortTopics = (topics: string[]) => {
    const topicOrder = ["General Information", "Environment metrics", "Social metrics", "Governance metrics"];
    return topics.sort((a, b) => {
      const aIndex = topicOrder.indexOf(a);
      const bIndex = topicOrder.indexOf(b);
      
      // If both topics are in the order array, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in the order array, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // If neither is in the order array, sort alphabetically
      return a.localeCompare(b);
    });
  };

  // Custom sort function for sections based on disclosure number
  const sortSections = (sections: string[]) => {
    return sections.sort((a, b) => {
      // Extract the disclosure number (e.g., "B3" from "Energy and greenhouse gas emissions")
      // We'll use the metrics data to find the disclosure for each section
      const aMetric = metrics.find(m => m.section === a);
      const bMetric = metrics.find(m => m.section === b);
      
      const aDisclosure = aMetric?.disclosure || "";
      const bDisclosure = bMetric?.disclosure || "";
      
      // Extract numeric part from disclosure (e.g., "3" from "B3")
      const aNum = parseInt(aDisclosure.replace(/[^0-9]/g, '')) || 999;
      const bNum = parseInt(bDisclosure.replace(/[^0-9]/g, '')) || 999;
      
      return aNum - bNum;
    });
  };

  // Custom sort function for sub-sections based on disclosure number
  const sortSubSections = (subSections: string[]) => {
    return subSections.sort((a, b) => {
      // Find metrics for each sub-section to get their disclosure info
      const aMetric = metrics.find(m => m.subSection === a);
      const bMetric = metrics.find(m => m.subSection === b);
      
      const aDisclosure = aMetric?.disclosure || "";
      const bDisclosure = bMetric?.disclosure || "";
      
      // Extract numeric part from disclosure
      const aNum = parseInt(aDisclosure.replace(/[^0-9]/g, '')) || 999;
      const bNum = parseInt(bDisclosure.replace(/[^0-9]/g, '')) || 999;
      
      return aNum - bNum;
    });
  };

  // Get unique values for each filter with custom sorting
  const topics = sortTopics(Array.from(new Set(
    metrics
      .map(metric => metric.topic)
      .filter((topic): topic is string => Boolean(topic && topic.trim() !== ''))
  )));

  // Filter sections based on selected topic
  const availableSections = selectedTopic 
    ? sortSections(Array.from(new Set(
        metrics
          .filter(metric => metric.topic === selectedTopic)
          .map(metric => metric.section)
          .filter((section): section is string => Boolean(section && section.trim() !== ''))
      )))
    : sortSections(Array.from(new Set(
        metrics
          .map(metric => metric.section)
          .filter((section): section is string => Boolean(section && section.trim() !== ''))
      )));

  // Filter sub-sections based on selected topic and section
  const availableSubSections = selectedTopic && selectedSection
    ? sortSubSections(Array.from(new Set(
        metrics
          .filter(metric => 
            metric.topic === selectedTopic && 
            metric.section === selectedSection
          )
          .map(metric => metric.subSection)
          .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
      )))
    : selectedTopic
    ? sortSubSections(Array.from(new Set(
        metrics
          .filter(metric => metric.topic === selectedTopic)
          .map(metric => metric.subSection)
          .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
      )))
    : sortSubSections(Array.from(new Set(
        metrics
          .map(metric => metric.subSection)
          .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
      )));

  // Input types can be filtered based on current selections
  const availableInputTypes = selectedTopic || selectedSection || selectedSubSection
    ? Array.from(new Set(
        metrics
          .filter(metric => {
            const topicMatch = !selectedTopic || metric.topic === selectedTopic;
            const sectionMatch = !selectedSection || metric.section === selectedSection;
            const subSectionMatch = !selectedSubSection || metric.subSection === selectedSubSection;
            return topicMatch && sectionMatch && subSectionMatch;
          })
          .map(metric => metric.inputType)
          .filter((inputType): inputType is string => Boolean(inputType && inputType.trim() !== ''))
      )).sort()
    : Array.from(new Set(
        metrics
          .map(metric => metric.inputType)
          .filter((inputType): inputType is string => Boolean(inputType && inputType.trim() !== ''))
      )).sort();

  const hasActiveFilters = selectedTopic && selectedTopic !== "all" || 
                          selectedSection && selectedSection !== "all" || 
                          selectedSubSection && selectedSubSection !== "all" || 
                          selectedInputType && selectedInputType !== "all";

  const handleTopicChange = (value: string) => {
    const newTopic = value === "all" ? "" : value;
    onTopicChange(newTopic);
    
    // Clear section and sub-section if they're no longer valid for the new topic
    if (newTopic && selectedSection) {
      const validSections = Array.from(new Set(
        metrics
          .filter(metric => metric.topic === newTopic)
          .map(metric => metric.section)
          .filter((section): section is string => Boolean(section && section.trim() !== ''))
      ));
      
      if (!validSections.includes(selectedSection)) {
        onSectionChange("");
        onSubSectionChange("");
      } else if (selectedSubSection) {
        // Check if sub-section is still valid
        const validSubSections = Array.from(new Set(
          metrics
            .filter(metric => 
              metric.topic === newTopic && 
              metric.section === selectedSection
            )
            .map(metric => metric.subSection)
            .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
        ));
        
        if (!validSubSections.includes(selectedSubSection)) {
          onSubSectionChange("");
        }
      }
    }
  };

  const handleSectionChange = (value: string) => {
    const newSection = value === "all" ? "" : value;
    onSectionChange(newSection);
    
    // Clear sub-section if it's no longer valid for the new section
    if (newSection && selectedSubSection) {
      const validSubSections = Array.from(new Set(
        metrics
          .filter(metric => {
            const topicMatch = !selectedTopic || metric.topic === selectedTopic;
            return topicMatch && metric.section === newSection;
          })
          .map(metric => metric.subSection)
          .filter((subSection): subSection is string => Boolean(subSection && subSection.trim() !== ''))
      ));
      
      if (!validSubSections.includes(selectedSubSection)) {
        onSubSectionChange("");
      }
    }
  };

  const handleSubSectionChange = (value: string) => {
    onSubSectionChange(value === "all" ? "" : value);
  };

  const handleInputTypeChange = (value: string) => {
    onInputTypeChange(value === "all" ? "" : value);
  };

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg border">
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
              {availableSections.map(section => (
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
              {availableSubSections.map(subSection => (
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
              {availableInputTypes.map(inputType => (
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
            <Badge className="text-xs bg-[#077bc0] text-white hover:bg-[#077bc0]/80">
              Topic: {selectedTopic.replace("Enviornment", "Environment")}
              <button
                onClick={() => onTopicChange("")}
                className="ml-1 hover:text-red-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSection && selectedSection !== "all" && (
            <Badge className="text-xs bg-[#077bc0] text-white hover:bg-[#077bc0]/80">
              Section: {selectedSection}
              <button
                onClick={() => onSectionChange("")}
                className="ml-1 hover:text-red-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSubSection && selectedSubSection !== "all" && (
            <Badge className="text-xs bg-[#077bc0] text-white hover:bg-[#077bc0]/80">
              Sub-Section: {selectedSubSection}
              <button
                onClick={() => onSubSectionChange("")}
                className="ml-1 hover:text-red-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedInputType && selectedInputType !== "all" && (
            <Badge className="text-xs bg-[#077bc0] text-white hover:bg-[#077bc0]/80">
              Type: {selectedInputType}
              <button
                onClick={() => onInputTypeChange("")}
                className="ml-1 hover:text-red-200"
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
