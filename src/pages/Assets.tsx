import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ApiTable, { TableColumn } from "@/components/ApiTable";

const Assets = () => {
  const columns: TableColumn[] = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    { key: "code", header: "Code" },
    { key: "category", header: "Category", type: "object" },
    { key: "make", header: "Make" },
    { key: "model", header: "Model" },
    { key: "location", header: "Location", type: "object" },
    { key: "is_online", header: "Online Status", render: (value) => value ? "Online" : "Offline" },
    { 
      key: "_dataSource", 
      header: "Type", 
      render: (value) => value === "primary" ? "Equipment" : "Attachment" 
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex gap-4 mb-6">
        <Button asChild>
          <Link to="/assets/equipment/create">
            <Plus className="mr-2 h-4 w-4" />
            New Equipment
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/assets/attachment/create">
            <Plus className="mr-2 h-4 w-4" />
            New Attachment
          </Link>
        </Button>
      </div>

      <ApiTable
        endpoint="/assets/equipments"
        secondaryEndpoint="/assets/attachments"
        columns={columns}
        title="All Assets"
        queryKey={["assets", "all"]}
        emptyMessage="No assets found"
        editRoutePattern="/assets/edit/{id}"
      />
    </div>
  );
};

export default Assets;