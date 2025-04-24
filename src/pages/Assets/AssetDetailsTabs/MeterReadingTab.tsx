import { useParams } from "react-router";
import { ApiForm, ApiTable } from "../../../components";
import { useEffect, useState } from "react";
import { ApiFormProps } from "../../../types/ApiFormTypes";


const MeterReadingTab =  () => {
    const id = useParams().id
    
    const endPoint =`meter-readings/`
    const [data, setData] = useState()
    const [reloadTable, setReloadTable] = useState(false)

    useEffect(() => {
        setReloadTable(true)
    }, [data])

    const apiFormParams: ApiFormProps= {
        isNew:true,
        endPoint:endPoint,
        setMasterData: setData,        
        formName:"Meter Reading",
        children: [
            {
                label:"Asset",
                name:"asset",
                size:"3",
                component:"InputGroup",
                required:false,
                value:id,
                hidden:true
            },
            {
                label:"Meter Reading",
                name:"meter_reading",
                size:"6",
                component:"InputGroup",
                required:true
            }
        ]
    }
     
    return(
        <div className="main-container assets">
            <ApiTable
                endpoint={endPoint}
                paginate={false}
                pageSize={3}
                hasCreateButton={false}
                reload={reloadTable}
                setReload={setReloadTable}
                filters={{asset_id: id}}
                columns={[
                    { key: 'meter_reading', label: 'Meter Reading', type: 'string' },
                    { key: 'created_at', label: 'Creation Date', type: 'date' },
                    { key: 'created_by', label: 'Created By', type: 'object' },
                    
                ]}
            />
            <ApiForm {...apiFormParams}/>
        </div>
    )
    
}

export default MeterReadingTab;
 