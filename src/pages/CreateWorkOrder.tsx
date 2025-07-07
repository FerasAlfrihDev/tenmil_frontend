import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ApiForm from "@/components/ApiForm";
import { apiPost } from "@/utils/apis";
import { workOrderFields } from "@/data/workOrderFormFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateWorkOrder = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await apiPost("/work-orders/work_order", data);
      toast({
        title: "Success",
        description: "Work order created successfully!",
      });
      navigate("/workorders");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create work order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Work Order</h1>
        <p className="text-muted-foreground">
          Add a new work order to track maintenance tasks
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Form Section - 30% height */}
        <div className="h-[30%]">
          <ApiForm
            fields={workOrderFields}
            title="Work Order Information"
            onSubmit={handleSubmit}
            submitText="Create Work Order"
            className="h-full"
          />
        </div>

        {/* Tabs Section - 70% height */}
        <div className="flex-1">
          <Tabs defaultValue="tab1" className="h-full">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="h-full">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
                <p>Content for tab 1 will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="tab2" className="h-full">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
                <p>Content for tab 2 will go here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkOrder;