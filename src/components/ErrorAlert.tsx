import { FC } from "react"
import { Toast } from "react-bootstrap"
import { ErrorAlertProps } from "../types/ErrorAlertTypes"

const ErrorAlert:FC<ErrorAlertProps> = ({
    setShow,
    header="error",
    body,
    variant="danger"
}) => {
    
    return(
        <Toast onClose={() => setShow(false)} bg={variant} className="float-top d-inline-block m-1">
            <Toast.Header>
                <strong className="me-auto">{header}</strong>
            </Toast.Header>
            <Toast.Body className={'text-white'}>{body}</Toast.Body>
        </Toast>
        
    )
}

export default ErrorAlert;