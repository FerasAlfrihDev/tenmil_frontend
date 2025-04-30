
export type  ApiSwitchProps = {
    label:string,
    name:string,
    handelSwitchChange: (name:string, value:boolean) => void,
    selectedText:string,
    unSelectedText:string,
    value?:boolean,
    required? :boolean,
    size?: number,
    errorMsg?:string,
    disabled?: boolean,
}