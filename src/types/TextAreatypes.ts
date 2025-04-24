export type TextAreaProps = {
    label: string,
    name: string,
    value?: string,
    size?:string,
    required?: boolean,
    errorMsg?: string | null,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    helperMsg?:string | null,
}