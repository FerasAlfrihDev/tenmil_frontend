import { FC } from "react";
import { InputGroupProps } from "../types/InputGroupTypes";
import "../styles/global.scss"
import {  FloatingLabel, Form } from "react-bootstrap";

const InputGroup:FC<InputGroupProps> = ({
  label,
  name,
  type = 'text',
  value,
  size = "6",
  required = false,
  errorMsg,
  helperMsg,
  onChange,
  hidden=false,
  disabled=false
}) => {
    
  return (
    <Form.Group className={`mb-${size} api-form-element `}  controlId={name} hidden={hidden}  key={name}>
      <FloatingLabel
        id={name}
        label={label}
        className={`mb-${size}`}
      >
        { hidden ?
          <Form.Control type={type} placeholder={label} id={name} name={name} value={value} required={required} onChange={onChange} disabled={disabled}/>
          :
          <Form.Control type={type} placeholder={label} id={name} name={name} defaultValue={value} required={required} onChange={onChange} disabled={disabled}/>
        }
        {errorMsg &&
          <Form.Control.Feedback type="invalid">
            {errorMsg?.toString()}
          </Form.Control.Feedback>
        }
        {helperMsg && 
          <small>
            {helperMsg}
          </small>
        }
      </FloatingLabel>
      
    </Form.Group>
  )
}
export default InputGroup;