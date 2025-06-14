import { FC, useEffect, useState } from "react";
import { ApiFormProps } from "../types/ApiFormTypes";
import { Button, ButtonGroup, Col, Row, Card, Form, Spinner, Alert } from "react-bootstrap";
import { apiCall } from "../utils/api";
import InputGroup from "./InputGroup";
import ApiSelect from "./ApiSelect";
import { useParams } from "react-router";
// import { useNavigate, useParams } from "react-router";
import ApiSwitch from "./ApiSwitch";
import TextArea from "./TextArea";
import MaintenanceSpinner from "./MaintenanceSpinner";
// import ErrorAlert from "./ErrorAlert";

const ApiForm: FC<ApiFormProps> = ({
    formName,
    viewOnly = false,
    oriantation = 'vertical',
    submitButtonName = 'Save',
    addAnotherButton = false,
    singleIntityForm,
    ...props
  }) => {
    const params = useParams();
    const [errors, setErrors] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [id, setId] = useState<string | undefined>(props.isNew ? undefined : params.id);
    // const [addNew, setAddNew] = useState(false);
    const [isNew, setIsNew] = useState(props.isNew);
    const handleHiddenFields = (fieldName: string, value: any) => {
      setFormData({ ...formData, [fieldName]: value });
    };
    // const encodeEndpoint = (endpoint: string) => endpoint.replace('/', '__');
    // const navigate = useNavigate();
    
    // const handleDynamicFormRoute = (id: string | 'new') => {
    //   navigate(`/form/${encodeEndpoint(props.endPoint)}/${id}`, {
    //     state: {
    //       formTemplate: props.children || data.map((col:any) => ({
    //         component: 'InputGroup',
    //         name: col.key,
    //         label: col.label,
    //         type: col.type === 'date' ? 'date' : 'text',
    //         required: true,
    //       }))
    //     }
    //   });
    // };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
  
      setValidated(true);
  
      const saveData = async () => {
        setLoading(true);
        setErrors(null);
  
        try {
          const method: "POST" | "PATCH" = isNew ? "POST" : "PATCH";
          const url = isNew ? props.endPoint : `${props.endPoint}/${id}`;
          const response = await apiCall<any>(url, method, formData);
          setData(response);
  
          // if (isNew && !singleIntityForm) {
          //   if (!addNew){
          //     setData(null)
          //     handleDynamicFormRoute('new')
          //   }
          //   handleDynamicFormRoute(response.id)
            
          // }
  
          props.setMasterData && (isNew ? props.setMasterData({}) : props.setMasterData(response));
        } catch (err: any) {
          setErrors(err.response?.data?.errors || { error: "Something went wrong." });
        } finally {
          setLoading(false);
        }
      };
  
      if (e.currentTarget.reportValidity()) {
        saveData();
      }
    };
  
    useEffect(() => {
      setData({ ...data, ...formData });
    }, [formData]);
    

    useEffect(() => {
      if (!isNew) {
        const fetchData = async () => {
          setLoading(true);
          setErrors(null);
  
          try {
            const response = await apiCall<any>(singleIntityForm ? props.endPoint : `${props.endPoint}/${id}`, 'GET', {}, singleIntityForm);            
            setData(response);
            if (singleIntityForm) setId(response.id);
          } catch (err: any) {
            setErrors(err.response?.data?.errors || { error: "Failed to load data." });
            if (singleIntityForm) {
              setIsNew(true);
            }
          } finally {
            setLoading(false);
          }
        };
  
        fetchData();
      }
  
      props.children?.map((child) => {
        child.hidden && handleHiddenFields(child.name, child.value || "");
      });
    }, []);

    return (
      <div className="api-form-container">
        {loading && <MaintenanceSpinner size={64} />}
        {errors?.error && <Alert variant="danger">{errors.error}</Alert>}
  
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
              <h5 className="mb-4 fw-bold text-primary">{formName}</h5>
  
              {oriantation === 'horizontal' ? (
                <Row>
                  {props.children?.map((child: any) => (
                    <Col key={child.name}>
                      {renderFormField(child, setFormData, formData, data)}
                    </Col>
                  ))}
                </Row>
              ) : (
                <>
                  {props.children?.map((child: any) => renderFormField(child, setFormData, formData, data))}
                </>
              )}
  
              
              <ButtonGroup className="d-flex justify-content-end mt-4">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-floppy me-2"></i> {submitButtonName}
                    </>
                  )}
                </Button>

                {isNew && addAnotherButton && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      // setAddNew(true);
                      document.getElementById(`submit-${formName}`)?.click();
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" /> Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-node-plus me-2">Save and Add Another</i> 
                      </>
                    )}
                  </Button>
                )}
              </ButtonGroup>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  };
  
  // Helper to render child fields
  function renderFormField(child: any, setFormData: any, formData: any, data:any) {
    console.log("renderFormField", child);
    
    const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    const handelSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    };

    const handelSwitchChange = (name: string, value: boolean) => {
    setFormData({ ...formData, [name]: value });
    };
    switch (child.component) {
      case "InputGroup":
        return (
          <InputGroup
            {...child}
            disabled={child.disabled || false}
            value={formData[child.name] ?? data?.[child.name] ?? child.value ?? ''}
            onChange={handelInputChange}
          />
        );
      case "TextArea":
        return (
          <TextArea
            {...child}
            disabled={child.disabled || false}
            value={formData[child.name] ?? data?.[child.name] ?? child.value ?? ''}
            onChange={handelInputChange}
          />
        );
      case "Select":
        return (
          <ApiSelect
            {...child}
            disabled={child.disabled || false}
            value={formData[child.name] ?? data?.[child.name] ?? child.value ?? ''}
            handelSelectChange={handelSelectChange}
          />
        );
      case "Switch":
        return (
          <ApiSwitch
            {...child}
            disabled={child.disabled || false}
            value={formData[child.name] ?? data?.[child.name] ?? child.value ?? ''}
            handelSwitchChange={handelSwitchChange}
          />
        );
      default:
        return null;
    }
  }
  
  export default ApiForm;