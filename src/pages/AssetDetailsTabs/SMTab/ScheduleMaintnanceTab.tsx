import { useEffect, useState } from "react";
import { apiCall } from "../../../utils/api";
import { useParams } from "react-router-dom";
import { SmLogs, SmSettingsTab, WoLogs, NextWo } from "..";

const ScheduleMaintnanceTab =  () => {
    const asset_id = useParams().id
    const endPoint = "scheduled-maintenance/get-info"
    const [data, setData] = useState<any>(null)
    


   
    useEffect(()=> {
         const fetchData = async() => {
        // fetch data from backend
            try {
                const params:any = {
                
                    }
                if (asset_id && (params["asset"] = asset_id)){
                    const res = await apiCall<any[]>(endPoint, "GET", undefined, params);                    
                    setData(res[0])
                } 
              
            } catch (err: any) {
              console.error('API Fetch Error:', err);
            } finally {
              
            }
        }
        fetchData()
        
    }, [])

    return(
        <div className="sm-container">
            <div className="sm-header">
                <span>Next Trigger: {data?.next_trigger}</span>
                <span>Next PM: {data?.next_cycle}</span>
            </div>
            <NextWo 
            asset_id={asset_id}
            data={data}
            endPoint={endPoint}
             />
            <SmSettingsTab/>
            <WoLogs/>
            <SmLogs/>
            
        </div>
    )
}
export default ScheduleMaintnanceTab;