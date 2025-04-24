export type ApiDragNDropProps = {
    endPoint:string
}
export type DNDItemtype = {
    id:string, 
    name:string,
}
export type DNDItemProps = DNDItemtype & {
    parentName:string,
    onDrop: (name:string) => void,
    setActiveItem: (name:string) => void
}

export type DropAreaProps = {
    parentName:string,
    onDrop: (name:string) => void
}

export type DragItemProps = {
}