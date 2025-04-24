import { FC, useEffect, useState } from "react";
import "../styles/dndStyles.scss";
import { DropAreaProps } from "../types/ApiDragNDropTypes";

const DropArea:FC <DropAreaProps> = ({parentName, onDrop}) => {
    const [show, setShow] = useState(false)
    const [className, setClassName] = useState("drop-area-hide")

    useEffect(()=>{
        
        // console.log("DropAreaProps name", name)
        show ?        
            setClassName("drop-area" )
            :
            setClassName("drop-area-hide")
        
    }, [show])
    return(
        <div 
            className={className} 
            onDragEnter={()=>setShow(true)}
            onDragLeave={() => setShow(false)}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onDrop={(e) => {
                e.preventDefault()
                onDrop(parentName)
                setShow(false)
                
            }}
        >

        </div>
    )
};
 
export default DropArea;