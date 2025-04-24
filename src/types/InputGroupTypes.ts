export type InputGroupProps = {
    label: string,
    name: string,
    type?: string,
    value?: string,
    size?:string,
    required?: boolean,
    errorMsg?: string | null,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    hidden?:boolean,
    disabled?:boolean,
    helperMsg?:string | null,
}