import { useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import MeterReadingTriggerForm from "./MeterReadingTriggerForm"
import TimeTriggerForm from "./TimeTriggerForm"

const SmSettings:React.FC = () => {
    const [selectedTrigger, setSelectedTrigger] = useState<'meter'|'time'>("meter")
    return(
        <div className="sm-section">
            <big>SM settings</big>
            
            <Tabs
                defaultActiveKey={selectedTrigger}
                id="uncontrolled-tab-example"
                className="mb-3"
                fill
            >
                <Tab eventKey="meter" title="Meter Reading Trigger">
                    <MeterReadingTriggerForm/>
                </Tab>
                <Tab eventKey="time" title="Time Trigger">
                    <TimeTriggerForm/>
                </Tab>                
            </Tabs>
        </div>
    )
}
export default SmSettings;