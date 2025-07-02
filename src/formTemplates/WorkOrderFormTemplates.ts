export const WorkOrderFormTemplate = [
  {
    label:"Code",
    name:"code",
    size:"4",
    component:"InputGroup",
    required:false,
    disabled:true
  },
  {
    label:"Asset",
    name:"asset",
    size:"1",
    component:"Select",
    required:true,
    endpoint:"assets/equipments",
    hasCreateButton:true,
    createButtonLink:"/assets/new",
    createButtonName:"New Asset",
    createButtonIcon:true

  },
  {
    label:"Status",
    name:"status",
    size:"3",
    component:"Select",
    required:true,
    endpoint:"work-orders/status",
    hasCreateButton:false,
  },
  {
    label:"Maint Type",
    name:"maint_type",
    size:"3",
    component:"InputGroup",
    required:true
  },
  {
    label:"Priority",
    name:"priority",
    size:"3",
    component:"InputGroup",
    required:true
  },
  {
    label:"Starting Meter Reading",
    name:"starting_meter_reading",
    size:"3",
    component:"InputGroup",
    required:false
  },
  {
    label:"Completion Meter Reading",
    name:"completion_meter_reading",
    size:"3",
    component:"InputGroup",
    required:false
  },         
  {
    label:"Suggested Start Date",
    name:"suggested_start_date",
    size:3,
    component:"DatePicker",
    required:false,
  },
  {
    label:"Completion Date",
    name:"completion_end_date",
    size:3,
    component:"DatePicker",
    required:false,
  },
  {
    label:"Description",
    name:"description",
    size:6,
    component:"TextArea",
    required:false,
  }
]