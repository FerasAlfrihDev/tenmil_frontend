
import IttirationSettings from "./IttirationSettings";
import SmSettings from "./SmSettings";
import StartingWO from "./StartingWO";

const SmSettingsTab:React.FC = () => {
  return(
    <div className="sm-settings">
        <SmSettings/>
        <IttirationSettings/>        
        <StartingWO/>            
    </div>
  )
};

export default SmSettingsTab;