import { FC, useEffect, useState } from 'react';
import {  Button, FloatingLabel, Form } from 'react-bootstrap';
import { ApiSelectProps } from '../types/ApiSelectTypes';
import { apiCall } from "../utils/api";

const ApiSelect:FC<ApiSelectProps> = ({
    label,
    name,
    endpoint,
    handelSelectChange,
    required=false,
    size,
    errorMsg,
    hasCreateButton=false,
    createButtonLink="",
    createButtonName="",
    createButtonIcon,
    value,
    disabled=false,
}) => {
        const [selected, setSelected] = useState<string | undefined>("0");
        const [options, setOptions] = useState<{"id": string, "name":string}[]>([{"id": "0", "name":`select ${label}`}]);
        // const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState<any[]|null>(null);

        const CreateButtonIcon:FC = () => {
            return(
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                </svg>
                )
        }

        const fetchData = async () => {
            // setLoading(true);
            setErrors(null);          
            try {
                
                const response = await apiCall<any[]>(endpoint, 'GET');
                setOptions([...options, ...response]);
            } catch (err: any) {              
                setErrors(err.response.data.errors);
            } finally {
                // setLoading(false);
            }
          };

    useEffect(() => {
        fetchData();
          
    }, [])

    useEffect(() => {
        if (value) {
            let modified_value = typeof(value) == "string" ? value : value.id
            setSelected(modified_value)
        }
          
    }, [value])

    const handleOnSelect = (item:{id: string, name:string}) => {
        setSelected(item.id)
        handelSelectChange(item.name, item.id)
    }
    
    useEffect(()=>{
        errors && errors.map((error)=>{
            console.error(error);
            
        })

    }, [errors])
    
  return (
    <Form.Group controlId={name} key={name} className={`mb-${size} api-form-element`}>
      <FloatingLabel
        id={name}
        label={label}
        className="mb-3 flex-horizental"
        
      >
        <Form.Select id={name} name={name} size={size} 
        value={selected} required={required} onChange={(e)=>handleOnSelect({id: e.target.value, name: name})} disabled={disabled}>
        {
            options.map((select_option)=>
                    <option key={select_option.id} value={select_option.id} >{select_option.name ||  select_option.id}</option>
               )
        }
        </Form.Select>
        { 
            hasCreateButton && 
            <Button variant={createButtonIcon ? 'link' :'success' } href={createButtonLink} title={createButtonName}>{createButtonIcon ? <CreateButtonIcon/> : createButtonName}</Button>
        }
      </FloatingLabel>
      
        
        <Form.Control.Feedback type="invalid">
            {errorMsg}
        </Form.Control.Feedback>
    </Form.Group>
  );
}

export default ApiSelect;