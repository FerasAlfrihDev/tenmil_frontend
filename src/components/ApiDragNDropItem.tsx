import { FC, Fragment } from "react";
import { DNDItemProps } from "../types/ApiDragNDropTypes";
import DropArea from "./DropArea";

const ApiDragNDropItem:FC<DNDItemProps> = ({id, name, onDrop, setActiveItem, parentName}) => {
    // useDragger(id)
    return(
        <Fragment key={id} >
            <div id={id} className="dnd-item" draggable onDragStart={()=>setActiveItem(id) }>
                {name}
            </div>
            <DropArea parentName={parentName} onDrop={onDrop}/>
        </Fragment>
    )
};
export default ApiDragNDropItem;