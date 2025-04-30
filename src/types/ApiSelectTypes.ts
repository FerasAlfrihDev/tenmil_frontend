
export type  ApiSelectProps = {
    label:string,
    name:string,
    endpoint:string,
    handelSelectChange: (name:string, value:string) => void,
    hasCreateButton?:boolean,
    createButtonLink?:string,
    createButtonName?:string,
    createButtonIcon?:boolean,
    value?:any,
    required? :boolean,
    size?: "sm" | "lg" | undefined,
    errorMsg?:string,
    disabled?: boolean,
}