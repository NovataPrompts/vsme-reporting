
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import ReportStatusDropdown from './ReportStatusDropdown';
import ReportActionButtons from './ReportActionButtons';

export type Report = {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  status: string;
};

type ReportsTableProps = {
  reports: Report[];
  onStatusChange: (reportId: string, newStatus: string) => void;
  onEditClick: (reportId: string) => void;
  onActionClick: (action: string, reportId: string) => void;
};

const ReportsTable = ({ 
  reports, 
  onStatusChange, 
  onEditClick, 
  onActionClick 
}: ReportsTableProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.dateCreated}</TableCell>
                  <TableCell>
                    <ReportStatusDropdown 
                      status={report.status} 
                      reportId={report.id} 
                      onStatusChange={onStatusChange} 
                    />
                  </TableCell>
                  <TableCell>
                    <ReportActionButtons 
                      reportId={report.id}
                      status={report.status} 
                      onEditClick={onEditClick} 
                      onActionClick={onActionClick} 
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="text-center py-8 text-gray-500">
                    <p>No reports available</p>
                    <p className="text-sm mt-2">Create your first report to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportsTable;
