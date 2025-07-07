import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus } from "lucide-react";
import { apiGet } from "@/utils/apis";
import GearSpinner from "@/components/ui/gear-spinner";

export interface TableColumn<T = any> {
  key: string;
  header: string;
  type?: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface ApiTableProps<T = any> {
  endpoint: string;
  secondaryEndpoint?: string; // Optional secondary endpoint to fetch additional data
  columns: TableColumn<T>[];
  title?: string;
  queryKey?: string[];
  className?: string;
  emptyMessage?: string;
  createNewHref?: string;
  createNewText?: string;
  editRoutePattern?: string; // e.g., "/assets/edit/{id}"
  onRowClick?: (row: T) => void;
}

const ApiTable = <T extends Record<string, any>>({
  endpoint,
  secondaryEndpoint,
  columns,
  title,
  queryKey,
  className,
  emptyMessage = "No data available",
  createNewHref,
  createNewText = "Create New",
  editRoutePattern,
  onRowClick,
}: ApiTableProps<T>) => {
  const navigate = useNavigate();
  
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: queryKey || (secondaryEndpoint ? [endpoint, secondaryEndpoint] : [endpoint]),
    queryFn: async () => {
      const promises = [apiGet(endpoint)];
      
      // Add secondary endpoint if provided
      if (secondaryEndpoint) {
        promises.push(apiGet(secondaryEndpoint));
      }
      
      const responses = await Promise.all(promises);
      
      // Extract data from responses
      const primaryData = responses[0].data.data || responses[0].data;
      const secondaryData = secondaryEndpoint && responses[1] 
        ? responses[1].data.data || responses[1].data 
        : [];
      
      // Add source metadata to each row
      const primaryWithSource = Array.isArray(primaryData) 
        ? primaryData.map((item: any) => ({ ...item, _dataSource: 'primary' }))
        : [];
        
      const secondaryWithSource = Array.isArray(secondaryData) 
        ? secondaryData.map((item: any) => ({ ...item, _dataSource: 'secondary' }))
        : [];
      
      // Combine data arrays
      return [...primaryWithSource, ...secondaryWithSource];
    },
  });

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (editRoutePattern && row.id) {
      const editRoute = editRoutePattern.replace("{id}", row.id.toString());
      navigate(editRoute);
    }
  };

  const isRowClickable = Boolean(onRowClick || editRoutePattern);

  const renderCell = (column: TableColumn<T>, row: T) => {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    if (column.type === "object" && value && typeof value === "object") {
      return value.name || value.id || "";
    }
    return value?.toString() || "";
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <GearSpinner fullscreen />
    </div>
  );

  const ErrorAlert = () => (
    <Alert variant="destructive">
      <AlertDescription>
        Failed to load data: {error?.message || "Unknown error"}
      </AlertDescription>
    </Alert>
  );

  const EmptyState = () => (
    <div className="text-center py-8 text-muted-foreground">
      {emptyMessage}
    </div>
  );

  const content = () => {
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorAlert />;

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row: T, index: number) => (
                <TableRow 
                  key={row.id || index}
                  className={isRowClickable ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                  onClick={() => isRowClickable && handleRowClick(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {createNewHref && (
              <Button asChild size="sm">
                <Link to={createNewHref}>
                  <Plus className="mr-2 h-4 w-4" />
                  {createNewText}
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>{content()}</CardContent>
      </Card>
    );
  }

  return <div className={className}>{content()}</div>;
};

export default ApiTable;