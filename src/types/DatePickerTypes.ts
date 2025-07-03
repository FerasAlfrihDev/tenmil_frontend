export type DatePickerProps = {
    label: string,
    name: string,
    value?: string,
    size?:string,
    required?: boolean,
    errorMsg?: string | null,
    onChange: (name:string, value:string)=> void,
}