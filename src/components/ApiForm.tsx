import { FC, useEffect, useState } from "react";
import { ApiFormProps } from "../types/ApiFormTypes";
import {Button,  ButtonGroup,  Col, Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { apiCall } from "../utils/api";
import LoadingModal from "./LoadingModal";
import InputGroup from "./InputGroup";
import ApiSelect from "./ApiSelect";
import { useParams } from "react-router";
import ApiSwitch from "./ApiSwitch";
import TextArea from "./TextArea";
import ErrorAlert from "./ErrorAlert";

const ApiForm:FC<ApiFormProps> = ({  
  formName,
  viewOnly=false,
  oriantation='vertical',
  submitButtonName= 'Submit',
  addAnotherButton=false,
  singleIntityForm,
  ...props
}) => {
    const [errors, setErrors] = useState<any>()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [id, setId] = useState<string|undefined>()
    const [addNew, setAddNew] = useState(false)
    const [isNew, setIsNew] = useState(props.isNew)
    if (!isNew && !id){
      let params = useParams()
      setId(params.id)
    }
    
    const handleHiddenFields = (fieldName:string, value:any) => {
      setFormData({...formData, [fieldName]: value});
    }

    const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handelSelectChange = (name:string, value:string) => {
      setFormData({...formData, [name]: value});
    }
    const handelSwitchChange = (name:string, value:boolean) => {
      setFormData({...formData, [name]: value});
    }
    const handleSubmitButon = () => {
        let btn = document.getElementById(`submit-${formName}`);
        btn?.click();
    }
    const handleSubmitAddButon = () => {
        setAddNew(true)
        let btn = document.getElementById(`submit-${formName}`);
        btn?.click();
    }
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const form = e.currentTarget;
      
      setValidated(true);
      const fetchData = async () => {
        setLoading(true);
        setErrors(null);          
        try {
            let method:  "POST" | "PATCH" = isNew ? "POST" : "PATCH"
            let url = isNew ? props.endPoint : `${props.endPoint}/${id}`
            const response = await apiCall<any>(url, method, formData);
            // let responseData= {};

            // console.log("response", response);
            // Object.keys(response).map((key:any)=>{
            //   responseData = {...responseData, [key]: typeof(response[key]) == "object" ? response[key]['id'] : response[key]}
            // })
            // console.log("responseData", responseData);
            
            setData(response);
            
            if (isNew && !singleIntityForm){
              let redirectPath = location.pathname;
              if (!addNew){
                redirectPath = redirectPath.replace("new", `${response.id}`)
              }
              setData(undefined)
              window.location.href = redirectPath
              
            }
            props.setMasterData && (isNew ? props.setMasterData({}) : props.setMasterData(response));
          } catch (err: any) {
            setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
      };

      form.reportValidity() && fetchData();
      
    }

    useEffect(()=>{
      setData({...data, ...formData})      
    }, [formData])

    useEffect(()=>{
      console.log("data", data);
      
    }, [data])

    useEffect(()=>{
      if (!isNew) {
        const fetchData = async () => {
          setLoading(true);
          setErrors(null);
          if (singleIntityForm) {
            try {              
              const response = await apiCall<any>(`${props.endPoint}`, 'GET', {}, singleIntityForm);
              setData(response);
              setId(response.id);
          } catch (err: any) {                
              setId(undefined);
              setIsNew(true);
          } finally {
              setLoading(false);
          }
          }
          
          else {  
            try {              
                const response = await apiCall<any>(`${props.endPoint}/${id}`, 'GET');
                setData(response);
            } catch (err: any) {                
                setErrors(err.response.data.errors);
            } finally {
                setLoading(false);
            }
          };
        }
        fetchData()
      }
      props.children?.map((child)=>{
        child.hidden && handleHiddenFields(child.name, child.value || "")
      })
    }, [])

    useEffect(()=>{
      console.error(addNew);
      
    }, [addNew])
 
    return(
        <div className="api-form-container">          
          {
            loading &&
              <LoadingModal loading={loading}/>
          }
          {
            errors && errors.error  && <ErrorAlert setShow={setErrors} body={errors.error}/>
          }
          <Form onSubmit={(e)=>handleSubmit(e)} noValidate={true} validated={validated} className={`api-form ${props.className}`}>
            <legend>{formName}</legend>
            {
             oriantation === 'horizontal' ?        
              <Row>
                {props.children?.map((child: any) =>{
                  
                  if (child.component === "InputGroup") {                
                    return( 
                      <Col  key={child.name}>
                        <InputGroup
                          label={child.label}
                          name={child.name}
                          size={child.size}
                          value={data && data[child.name] || child.value || undefined}
                          type={child.type || 'text'} 
                          required={child.required}
                          errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                          onChange={handelInputChange}
                          hidden ={child.hidden||false}
                          disabled={viewOnly || child.disabled || false}
                          helperMsg={child.helperMsg} 
                          {...child}
                        />
                      </Col>
                  )
                  }
                  else if (child.component === "TextArea") {                
                    return( 
                      <Col  key={child.name}>
                        <TextArea
                          label={child.label}
                          name={child.name}
                          size={child.size}
                          value={data && data[child.name] || child.value || undefined}
                          // errorMsg={errors}
                          required={child.required}
                          errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                          onChange={handelInputChange}
                          disabled={viewOnly || child.disabled || false}
                        />
                      </Col>
                  )
                  }
                  else if (child.component === "DatePicker") {                
                    return( 
                      <Col  key={child.name}>
                        <InputGroup
                          type='date'
                          label={child.label}
                          name={child.name}
                          size={child.size}
                          value={data && data[child.name] || undefined}
                          // errorMsg={errors}
                          required={child.required}
                          errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                          onChange={handelInputChange}
                          disabled={viewOnly || child.disabled || false}
                        />
                      </Col>
                  )
                  }
                  else if (child.component === "Select") {
                    return( 
                      <Col  key={child.name}>
                        <ApiSelect
                          label={child.label}
                          name={child.name}
                          endpoint={child.endpoint}
                          size={child.size}
                          handelSelectChange={handelSelectChange}
                          value={data && data[child.name] || "0"}
                          // errorMsg={errors}
                          required={child.required}
                          errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                          hasCreateButton={child.hasCreateButton || false}
                          createButtonLink={child.createButtonLink || ""}
                          createButtonName={child.createButtonName || ""}
                          createButtonIcon={child.createButtonIcon || false}
                          disabled={viewOnly || child.disabled || false}
                        />
                      </Col>
                    )
                  }
                  else if (child.component === "Switch") {
                    return( 
                      <Col  key={child.name}>
                        <ApiSwitch
                          label={child.label}
                          name={child.name}
                          size={child.size}
                          handelSwitchChange={handelSwitchChange}
                          value={data && data[child.name] || true}
                          required={child.required}
                          selectedText={child.selectedText}
                          unSelectedText={child.unSelectedText}
                          errorMsg={errors && errors[child.name] ? errors[child.name] : null}                          
                          disabled={viewOnly || child.disabled || false}
                        />
                      </Col>
                    )
                  }
                  
                })}
              </Row>
              :
              <>
              {
                props.children.map((child: any) =>{
                  
                if (child.component === "InputGroup") {                                  
                  return(
                    <InputGroup
                        label={child.label}
                        name={child.name}
                        size={child.size}
                        value={data && data[child.name] || child.value || undefined}
                        type={child.type || 'text'} 
                        required={child.required}
                        errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                        onChange={handelInputChange}
                        hidden ={child.hidden||false}
                        disabled={viewOnly || child.disabled || false}
                        helperMsg={child.helperMsg||null}
                        {...child}
                      />
                  )
                }
                else if (child.component === "TextArea") {                
                  return(
                    <TextArea
                      label={child.label}
                      name={child.name}
                      size={child.size}
                      value={data && data[child.name] || undefined}
                      // errorMsg={errors}
                      required={child.required}
                      errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                      onChange={handelInputChange}
                      disabled={viewOnly || child.disabled || false}
                      helperMsg={child.helperMsg||null}
                    />
                  )
                }
                else if (child.component === "DatePicker") {                
                  return(
                    <InputGroup
                      type='date'
                      label={child.label}
                      name={child.name}
                      size={child.size}
                      value={data && data[child.name] || undefined}
                      // errorMsg={errors}
                      required={child.required}
                      errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                      onChange={handelInputChange}
                      disabled={viewOnly || child.disabled || false}
                    />
                  )
                }
                else if (child.component === "Select") {
                  return(
                    <ApiSelect
                      label={child.label}
                      name={child.name}
                      endpoint={child.endpoint}
                      size={child.size}
                      handelSelectChange={handelSelectChange}
                      value={data && data[child.name] || "0"}
                      // errorMsg={errors}
                      required={child.required}
                      errorMsg={errors && errors[child.name] ? errors[child.name] : null}
                      hasCreateButton={child.hasCreateButton || false}
                      createButtonLink={child.createButtonLink || ""}
                      createButtonName={child.createButtonName || ""}
                      createButtonIcon={child.createButtonIcon || false}
                      disabled={viewOnly || child.disabled || false}
                    />
                  )
                }
                else if (child.component === "Switch") {
                  return(
                    <ApiSwitch
                      label={child.label}
                      name={child.name}
                      size={child.size}
                      handelSwitchChange={handelSwitchChange}
                      value={data && data[child.name] || true}
                      required={child.required}
                      selectedText={child.selectedText}
                      unSelectedText={child.unSelectedText}
                      errorMsg={errors && errors[child.name] ? errors[child.name] : null} 
                      disabled={viewOnly || child.disabled || false}            
                    />
                  )
                }
                
              })}
              </>
            }

            {!viewOnly &&
              <ButtonGroup aria-label="Controls" className="api-form-element api-form-button-group">
                <Button variant="primary" type="submit" disabled={loading} id={`submit-${formName}`} hidden>
                  {submitButtonName}
                </Button>
                
                <div className="api-form-button" onClick={()=>handleSubmitButon()} title="create">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                  </svg>
                </div>
                {isNew && addAnotherButton &&
                <div className="api-form-button" onClick={()=>{                  
                  handleSubmitAddButon()}}
                  title="add another"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-node-plus" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5zM11 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 11 5M1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                  </svg>
                </div>
                  
}
                {/* {isNew ?
                  <Button variant="danger" type="button" disabled={loading} className="api-form-button">
                    Cancel
                  </Button>
                :
                  <Button variant="danger" type="button" disabled={loading} className="api-form-button">
                    Delete
                  </Button>
                } */}
              </ButtonGroup>
            }
            
          </Form>
        </div>
    )
};
export default ApiForm;