export type ErrorAlertProps = {
    setShow: (status:boolean)=> void;
    header?: string,
    body:string,
    variant?: "danger" | "warning" | "info" | "success",
}