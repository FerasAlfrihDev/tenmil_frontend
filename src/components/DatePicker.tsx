import { FC } from "react";
import "../styles/global.scss"
import { Col, FloatingLabel, Form } from "react-bootstrap";
import { DatePickerProps } from "../types/DatePickerTypes";

const DatePicker:FC<DatePickerProps> = ({
  label,
  name,
  value,
  size = "6",
  required = false,
  errorMsg,
  onChange
}) => {
   
  return (
    <Form.Group className={`mb-${size}`} as={Col} controlId={name} >
      <FloatingLabel
        controlId={name}
        label={label}
        className="mb-3"
      >
        <Form.Control type={'date'} placeholder={label} id={name} name={name} defaultValue={value} required={required} onChange={onChange}/>
      </FloatingLabel>
      <Form.Control.Feedback type="invalid">
          {errorMsg}
        </Form.Control.Feedback>
    </Form.Group>
  )
}
export default DatePicker;