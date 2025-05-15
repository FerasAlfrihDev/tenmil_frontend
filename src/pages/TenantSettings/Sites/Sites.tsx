import { FC } from "react";
import { ApiTable } from "../../../components";
import "../../../styles/pages.scss"

const Sites:FC= () => {
    return (
        <div className="multi-tables">
            <div >
                <ApiTable
                    tableName="Sites"
                    endpoint="company/site"
                    useGeneratedPage={false}
                    detailsPageLink="sites"
                    columns={[
                        { key: 'code', label: 'Code' },
                        { key: 'name', label: 'Name' },
                    ]}/>

            </div>
            <div >
                <ApiTable
                    tableName="Locations"
                    endpoint="company/location"
                    useGeneratedPage={false}
                    detailsPageLink="locations"
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