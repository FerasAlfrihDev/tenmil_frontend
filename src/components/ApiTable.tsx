import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';
import Table from 'react-bootstrap/Table';
import LoadingModal from './LoadingModal';

interface ApiTableColumn {
    key: string;
    label: string;
    type?: 'number' | 'date' | 'string' | 'boolean' | 'object'; // Data type for column
    render?: (row: any) => React.ReactNode; // Custom render for column
}

interface ApiTableProps {
    endpoint: string; // API endpoint to fetch data
    columns: ApiTableColumn[]; // Column definitions
    paginate?: boolean, // Whether to paginate the table
    pageSize?: number; // Number of rows per page
    hasCreateButton?: boolean; // Whether to show a create button
    createButtonLink?: string, // Link for the create button
    createButtonName?: string; // Name of the create button
    reload?: boolean; // Whether to reload the table data on mount
    setReload?: (reload: boolean) => void; // Function to set the reload state
    filters?: any; // Filter to apply to the API call
}

const ApiTable: React.FC<ApiTableProps> = ({
    endpoint,
    columns,
    hasCreateButton=true,
    createButtonLink,
    // createButtonName = 'Create',
    // paginate=true,
    pageSize = 10,
    reload=false,
    filters={},
    setReload

}) => {
    const [data, setData] = useState<any[]>([]);
    // const [selectedRows, setSelectedRows] = useState<any[]>([]);
    // const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        // setError(null);

        try {
            const response = await apiCall<any[]>(endpoint, 'GET', undefined, {
                // page: currentPage,
                // pageSize,
                ...filters
            });
            setData(response);
        } catch (err: any) {
            // setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from the API
    useEffect(() => {
        
        fetchData();
    }, [endpoint, pageSize]);
    // }, [endpoint, currentPage, pageSize]);

    useEffect(()=>{
        console.log("reload", reload);
        
        if (reload) {
            fetchData();
            setReload && setReload(false)
        }
        
    }, [reload])

    // Handle row selection
    // const toggleRowSelection = (row: any) => {
    //     setSelectedRows((prev) =>
    //         prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    //     );
    // };


    // Pagination logic
    // const nextPage = () => setCurrentPage((prev) => prev + 1);
    // const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const goToDetailsPage = (id:string) => {
        let href = `${createButtonLink}/${id}`;
        let link = document.createElement("a");
        link.href = href;
        link.click();
        
    }

    return (        
        <div className='api-table-container'>
            {hasCreateButton && 
            <a href={`${createButtonLink}/new`}  className='api-table-create-btn' title='create'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                    <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5"/>
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                </svg>
            </a>}
            <div className="api-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>
                                    {col.label}                            
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {
                        loading ? 
                            <LoadingModal loading={loading}/>
                        :
                            <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index} onClick={()=>goToDetailsPage(row.id)}>
                                        {columns.map((col) => {
                                            if (col.type == 'boolean') {
                                                return (
                                                    <td  key={col.key}>
                                                        {
                                                            row[col.key] ? 
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                                </svg> 
                                                            : 
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                </svg>
                                                        }
                                                    </td>
                                                )
                                            }
                                            else if (col.type == 'object') {                                                
                                                return (
                                                    <td  key={col.key}>
                                                        { row[col.key] && row[col.key].name || row[col.key] && row[col.key].id
                                                        }
                                                    </td>
                                                )
                                            }
                                            else {
                                                let value = row[col.key]
                                                if (col.type == 'date') {
                                                    value = new Date(value).toLocaleDateString()
                                                } 
                                                return(
                                                    <td key={col.key}>
                                                        {col.render ? col.render(row) :  value }
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 2}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    }
                    
                </Table>
            </div>
            {/* {paginate && 
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button onClick={nextPage}>Next</button>
                </div>
            } */}
        </div>
    );
};

export default ApiTable;