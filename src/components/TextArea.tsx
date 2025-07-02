import { FC } from "react";
import "../styles/global.scss"
import {  FloatingLabel, Form } from "react-bootstrap";
import { TextAreaProps } from "../types/TextAreatypes";

const TextArea:FC<TextAreaProps> = ({
  label,
  name,
  value,
  size = "6",
  required = false,
  errorMsg,
  onChange,
  disabled=false,
  helperMsg,
}) => {
   
  return (
    <Form.Group className={`api-form-element mb-${size}`} controlId={name}  key={name}>
      <FloatingLabel
        id={name}
        label={label}
        className="mb-6"
      >
        <Form.Control as="textarea" rows={15} style={{ height: '8rem' }} placeholder={label} id={name} name={name} defaultValue={value} required={required} onChange={onChange} disabled={disabled}/>
        {helperMsg && 
          <small>
            {helperMsg}
          </small>
        }
      </FloatingLabel>
      {errorMsg &&
          <Form.Control.Feedback type="invalid">
            {errorMsg?.toString()}
          </Form.Control.Feedback>
        }
        
    </Form.Group>
  )
}
export default TextArea;