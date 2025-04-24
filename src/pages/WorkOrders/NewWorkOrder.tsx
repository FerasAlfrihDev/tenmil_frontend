import { FC } from "react";
import WorkOrderBase from "./WorkOrder";

const NewWorkOrder:FC = () => {
  return (
    <WorkOrderBase isNew={true}/>
  );
}

export default NewWorkOrder;