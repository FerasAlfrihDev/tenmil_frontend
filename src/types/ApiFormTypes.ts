export type ApiFormProps = {
    isNew: Boolean,
    formName: string,
    endPoint: string,
    children: any[],
    viewOnly?: boolean,
    oriantation?: "vertical" | "horizontal",
    submitButtonName? :string,
    id?: string|number,
    className?:string,
    hasAccessToken?: boolean,
    setMasterData?: (data: any) => void,
    addAnotherButton?: boolean,
    singleIntityForm?: { [key: string]: any },
    formTemplate:any[],
   

}