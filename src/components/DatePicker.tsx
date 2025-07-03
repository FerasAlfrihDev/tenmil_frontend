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

  const handleOnChange = (e:any) => {
    onChange(name, e.target.value)
  }

  return (
    <Form.Group className={`mb-${size}`} as={Col} controlId={name} >
      <FloatingLabel
        id={name}
        label={label}
        className="mb-3"
      >
        <Form.Control type={'date'} placeholder={label} id={name} name={name} defaultValue={value} required={required} onChange={(e)=>handleOnChange(e)}/>
      </FloatingLabel>
      <Form.Control.Feedback type="invalid">
          {errorMsg}
        </Form.Control.Feedback>
    </Form.Group>
  )
}
export default DatePicker;