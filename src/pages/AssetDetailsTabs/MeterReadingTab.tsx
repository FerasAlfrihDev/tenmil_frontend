import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { ApiFormProps } from "../../types/ApiFormTypes";
import { ApiForm, ApiTable } from "../../components";


const MeterReadingTab =  () => {
    const id = useParams().id
    
    const endPoint =`meter-readings/meter_reading`
    const [data, setData] = useState()
    const [reloadTable, setReloadTable] = useState(false)

    useEffect(() => {
        setReloadTable(true)
    }, [data])
    const formTemplate = [
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
    const apiFormParams: ApiFormProps= {
        isNew:true,
        endPoint:endPoint,
        setMasterData: setData,        
        formName:"Meter Reading",
        children: formTemplate,
        formTemplate:formTemplate
    }
     
    return(
        <div className="main-container assets">            
            <ApiForm {...apiFormParams}/>
            <ApiTable
                tableName="Meter Readings"
                endpoint={endPoint}
                paginate={false}
                pageSize={3}
                hasCreateButton={false}
                reload={reloadTable}
                setReload={setReloadTable}
                filters={{asset: id}}
                columns={[
                    { key: 'meter_reading', label: 'Meter Reading', type: 'string' },
                    { key: 'created_at', label: 'Creation Date', type: 'date' },
                    { key: 'created_by', label: 'Created By', type: 'object' },
                    
                ]}
            />
        </div>
    )
    
}

export default MeterReadingTab;
 