import { FC } from "react";
import { Modal, Spinner } from "react-bootstrap";


const LoadingModal: FC<{loading: boolean}> = (props) => {
    return(
        <Modal show={props.loading} size="lg" animation={true} centered={true}>
            <Modal.Body style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Spinner animation="grow"  variant="light"/>
            </Modal.Body>         
        </Modal> 
    )
}
export default LoadingModal;