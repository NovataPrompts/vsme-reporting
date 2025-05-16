
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ReportsSearchProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const ReportsSearch = ({ searchQuery, onSearchChange }: ReportsSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input 
        placeholder="Search reports..." 
        className="pl-10 rounded-full" 
        value={searchQuery} 
        onChange={e => onSearchChange(e.target.value)} 
      />
    </div>
  );
};

export default ReportsSearch;
