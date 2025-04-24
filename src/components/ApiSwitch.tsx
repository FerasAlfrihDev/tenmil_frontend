import { FC, useEffect, useState } from 'react';
import {   Form } from 'react-bootstrap';
import { ApiSwitchProps } from '../types/ApiSwitchTypes';

const ApiSwitch:FC<ApiSwitchProps> = ({
    label,
    name,
    handelSwitchChange,
    required=false,
    size=3,
    errorMsg,
    value,
    selectedText,
    unSelectedText,
    disabled=false,
}) => {
        const [checked, setChecked] = useState<boolean>(value||false);
        


    const handleOnChange = (item:{value: boolean, name:string}) => {
        setChecked(item.value)
        handelSwitchChange(item.name, item.value)
    }
    useEffect(() => {
            if (value) {
                
                setChecked(value)
            }
              
        }, [value])
    

  return (
    <Form.Group controlId={name} key={name} className={`mb-${size} api-form-element`}>
      <Form.Label>{label}</Form.Label>
      <Form.Check 
            type="switch"
            id="custom-switch"
            label={checked ? selectedText : unSelectedText}
            onChange={()=>handleOnChange({value:!checked, name})}
            required={required}
            size={size}
            checked={checked}
            disabled={disabled}
        />
        <Form.Control.Feedback type="invalid">
            {errorMsg}
        </Form.Control.Feedback>
    </Form.Group>
  );
}

export default ApiSwitch;