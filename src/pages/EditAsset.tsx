import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApiForm from "@/components/ApiForm";
import GearSpinner from "@/components/ui/gear-spinner";
import { AlertTriangle } from "lucide-react";
import { useAssetData } from "@/hooks/useAssetData";
import { useAssetSubmit } from "@/hooks/useAssetSubmit";
import { equipmentFields, attachmentFields } from "@/data/assetFormFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditAsset = () => {
  const { id } = useParams();
  const { assetType, assetData, isLoading, isError, error } = useAssetData(id);
  const { handleSubmit } = useAssetSubmit(id, assetType);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <GearSpinner fullscreen />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Asset</h1>
          <p className="text-muted-foreground">
            Update asset information
          </p>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load asset data: {error?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!assetType || !assetData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <GearSpinner fullscreen />
      </div>
    );
  }

  const currentFields = assetType === "equipment" ? equipmentFields : attachmentFields;
  const assetTypeName = assetType === "equipment" ? "Equipment" : "Attachment";

  // Transform date strings to Date objects and object values to IDs for dropdowns
  const initialData = {
    ...assetData,
    purchase_date: assetData?.purchase_date ? new Date(assetData.purchase_date) : undefined,
    // Transform object values to their IDs for dropdown compatibility
    category: assetData?.category?.id || assetData?.category || "",
    location: assetData?.location?.id || assetData?.location || "",
    equipment: assetData?.equipment?.id || assetData?.equipment || "",
  };

  const customLayout = ({ handleSubmit, formData, handleFieldChange, loading, error, renderField }: any) => (
    <div className="border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{assetTypeName} Information</h2>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Loading..." : "Save"}
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3 h-[calc(100%-4rem)]">
        {/* Left side - Name and description */}
        <div className="col-span-2 space-y-3">
          {renderField({ name: "name", type: "input", label: `${assetTypeName} Name`, required: true, inputType: "text" })}
          {renderField({ name: "description", type: "textarea", label: "Description", rows: 4 })}
        </div>
        
        {/* Middle - Basic info */}
        <div className="col-span-2 space-y-3">
          {renderField({ name: "code", type: "input", label: "Code", required: true, inputType: "text" })}
          {renderField({ 
            name: "category", 
            type: "dropdown", 
            label: "Category", 
            required: true, 
            endpoint: assetType === "equipment" ? "/assets/equipment_category" : "/assets/attachment_category",
            queryKey: assetType === "equipment" ? ["equipment_category"] : ["attachment_category"],
            optionValueKey: "id", 
            optionLabelKey: "name" 
          })}
          {renderField({ name: "location", type: "dropdown", label: "Location", required: true, endpoint: "/company/location", queryKey: ["company_location"], optionValueKey: "id", optionLabelKey: "name" })}
          {assetType === "attachment" && renderField({ name: "equipment", type: "dropdown", label: "Equipment", endpoint: "/assets/equipments", queryKey: ["assets_equipments"], optionValueKey: "id", optionLabelKey: "name" })}
          {assetType === "equipment" && renderField({ name: "purchase_date", type: "datepicker", label: "Purchase Date", required: true })}
        </div>
        
        {/* Right side - Details */}
        <div className="col-span-2 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>{renderField({ name: "make", type: "input", label: "Make", required: true, inputType: "text" })}</div>
            <div>{renderField({ name: "model", type: "input", label: "Model", required: true, inputType: "text" })}</div>
          </div>
          {renderField({ name: "serial_number", type: "input", label: "Serial Number", required: true, inputType: "text" })}
          {assetType === "attachment" && renderField({ name: "purchase_date", type: "datepicker", label: "Purchase Date", required: true })}
          {renderField({ name: "is_online", type: "switch", label: "Online", description: "Toggle between Online/Offline status" })}
        </div>
      </form>
    </div>
  );

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit {assetTypeName}</h1>
        <p className="text-muted-foreground">
          Update information for {assetData?.name || `${assetTypeName} #${id}`}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Form Section */}
        <div>
          <ApiForm
            fields={currentFields}
            onSubmit={handleSubmit}
            initialData={initialData}
            customLayout={customLayout}
          />
        </div>

        {/* Tabs Section */}
        <div className="flex-1">
          <Tabs defaultValue="parts-bom" className="h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="parts-bom">Parts/BOM</TabsTrigger>
              <TabsTrigger value="metering-events">Metering/Events</TabsTrigger>
              <TabsTrigger value="scheduled-maintenance">Scheduled Maintenance</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="log">Log</TabsTrigger>
            </TabsList>
            <TabsContent value="parts-bom" className="h-full mt-4">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Parts/BOM</h3>
                <p>Parts and Bill of Materials content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="metering-events" className="h-full mt-4">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Metering/Events</h3>
                <p>Metering and Events content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="scheduled-maintenance" className="h-full mt-4">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Scheduled Maintenance</h3>
                <p>Scheduled maintenance content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="financials" className="h-full mt-4">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Financials</h3>
                <p>Financial information content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="log" className="h-full mt-4">
              <div className="border rounded-lg p-4 h-full">
                <h3 className="text-lg font-semibold mb-2">Log</h3>
                <p>Activity log content will go here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EditAsset;