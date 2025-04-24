import { FC } from "react";
import { ApiTable } from "../../../components";
import "../../../styles/pages.scss"

const Sites:FC= () => {
    return (
        <div className="multi-tables">
            <div >
                <h2>Sites</h2>
                <ApiTable
                    endpoint="company/site"
                    createButtonLink='settings/sites'
                    columns={[
                        { key: 'code', label: 'Code' },
                        { key: 'name', label: 'Name' },
                    ]}/>

            </div>
            <div >
                <h2>Locations</h2>
                <ApiTable
                    endpoint="company/location"
                    createButtonLink='settings/locations'
                    columns={[
                        { key: 'site', label: 'Site', type:"object"},
                        { key: 'address', label: 'Address' },
                        { key: 'name', label: 'Name' },
                        { key: 'slug', label: 'Slug' },
                    ]}/>

            </div>
        </div>
    );
}

export default Sites;