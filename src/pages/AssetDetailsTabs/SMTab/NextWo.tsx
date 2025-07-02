import { Button, Form } from "react-bootstrap";
import { apiCall } from "../../../utils/api";
import { useEffect, useState } from "react";

const NextWO: React.FC<{asset_id?:string, endPoint:string, data:any}> = ({asset_id, endPoint, data}) => {
    
    const [nextWO, setNextWO] = useState<any>(null)
    const [currentMeterReading, setCurrentMeterReading] = useState<any>(0)
    useEffect(() => {
        data && setCurrentMeterReading(data.last_meter_reading)
    }, [data])
    const handleSubmitNextWO = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        asset_id && formData.append("asset_id", asset_id)
        nextWO ? formData.append("next_work_order", nextWO) : formData.append("next_work_order", data?.next_trigger)
        formData.append("starting_meter_reading", currentMeterReading)
        apiCall<any>(endPoint, "POST", formData)
    }

    return(
        <div className="sm-section next-wo">
            <big>Next WO</big>
            <Form
                onSubmit={handleSubmitNextWO}
                className="sm-next-wo-form"
            >
                <div className="sm-next-wo-form-text">
                    adjustments
                </div>
                <Form.Group>
                    <Form.Label>Next WO</Form.Label>
                    <Form.Control type="text" placeholder="Enter next WO" value={data?.next_cycle} disabled/>
                </Form.Group>
                
                <div className="sm-next-wo-or">OR</div>
                <Form.Group>
                    <Form.Label>I Want This</Form.Label>
                    <Form.Select
                        onChange={(e) => setNextWO(e.target.value)}
                    >
                        {data?.ittirations?.map((item: any) =>{
                            return(
                                <option key={item} value={item}>{item}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Current Meter reading</Form.Label>
                    <Form.Control type="number" placeholder="current meter reading" value={currentMeterReading} onChange={(e) => setCurrentMeterReading(e.target.value)}/>
                </Form.Group>
                <Button type="submit">
                    Generate next work order now
                </Button>
            </Form>
        </div>
    )
};

export default NextWO;