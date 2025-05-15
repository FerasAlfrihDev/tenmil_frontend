import { FC, useEffect, useState } from "react"
import { Table } from "react-bootstrap";
import { useParams } from "react-router";
import { apiCall } from "../../../utils/api";
import { ApiFormProps } from "../../../types/ApiFormTypes";
import { ApiForm } from "../../../components";


const FianancialTabContent:FC = () => {
    // const [errors, setErrors] = useState<string|null>(null)
    // const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const [ isNew, setIsNew] = useState(false)
    const id = useParams().id
    
    const fetchData = async () => {
        // setLoading(true);
        // setErrors(null);
        try {              
            const response = await apiCall<any[]>(`financial-reports/${id}`, 'GET');
            setData(response);
        } catch (err: any) {              
            // setErrors(err.response.data.errors);
        } finally {
            // setLoading(false);
        }
    };
    
    const formTemplate = [
        {
            label:"Asset",
            name:"asset",
            size:"1",
            component:"InputGroup",
            required:false,
            value:id,
            hidden:true
        },
        {
          label:"Purchase Cost",
          name:"purchase_cost",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Resale Cost",
          name:"resale_cost",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Finance Years",
          name:"finance_years",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Interest Rate",
          name:"interest_rate",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Expected Hours",
          name:"expected_hours",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Operational Cost Per Year",
          name:"operational_cost_per_year",
          size:"1",
          component:"InputGroup",
          required:true
        },
        {
          label:"Capital Work Cost",
          name:"capital_work_cost",
          size:"1",
          component:"InputGroup",
          required:true
        },
    ]

    const apiFormParams:ApiFormProps = {
        isNew:isNew,
        setMasterData:setData,
        endPoint:'financial-reports',
        formName:"",
        children:formTemplate,
        formTemplate:formTemplate
    }

    useEffect(()=>{
        fetchData();
        if (data == null || data == undefined)
            setIsNew(true);
        else setIsNew(false);
    },[data])
  return(
    <div className="financial-tab">
        <div className="financial-tab-table">
            {data &&
                <Table>
                    <thead>
                        <tr>
                            {Object.keys(data.table).map((key)=>{
                                return <th>{key}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        {Object.values(data.table).map((value:any)=>{
                                return <td>{value}</td>
                            })}
                        </tr>
                    </tbody>
                </Table>
            }
        </div>
        <div className="financial-tab-form">
            <ApiForm {...apiFormParams}/>
        </div>
    </div>
  )
}
export default FianancialTabContent;