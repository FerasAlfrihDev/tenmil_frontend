import { FC, useEffect, useState } from "react";
import { ApiDragNDropProps, DNDItemtype } from "../types/ApiDragNDropTypes";
import "../styles/dndStyles.scss";
import "../styles/global.scss";
import ApiDragNDropItem from "./ApiDragNDropItem";

const ApiDragNDrop:FC<ApiDragNDropProps> = () => {
    const [baseItems, setBaseItems] = useState<DNDItemtype[]>()
    const [data, setData] = useState<{name:string, items:DNDItemtype[]}[]>([])
    const [activeItem, setActiveItem] = useState<string>()

    const onDrop = (name:string) => {
        console.log(`column ${name}, item ${activeItem}`)
    }

    useEffect(()=>{
        console.log(activeItem);        
    }, [activeItem])

    useEffect(()=>{
        let items:DNDItemtype[] = [
            {
                id: "0",
                name: 'Item 0',
            },
            {
                id: "1",
                name: 'Item 1',
            },
            {
                id: "2",
                name: 'Item 2',
            },
        ]
        setBaseItems(items)
        let response:{name:string, items:DNDItemtype[]}[] = [
            {
                name: "500",
                items: [
                    {
                        id: "3",
                        name: 'Item 3',
                    },
                    {
                        id: "4",
                        name: 'Item 4',
                    },
                    {
                        id: "5",
                        name: 'Item 5',
                    },
                ]
            },
            {
                name: "1000",
                items: [
                    {
                        id: "6",
                        name: 'Item 6',
                    },
                    {
                        id: "7",
                        name: 'Item 7',
                    },
                    {
                        id: "8",
                        name: 'Item 8',
                    },
                ]
            }
        ]
        setData(response)
    }, [])
    
    return(
        <div className="main-container dnd h100 w100 flex-vertical">
            <h1>DND</h1>
            <h6>base items</h6>
            <div className="dnd-items dragger-parent flex-horizental flex-center local-gap-1 h50 w100">
                {baseItems?.map((item:DNDItemtype)=>{
                    return(
                        <ApiDragNDropItem id={item.id} name={item.name} parentName="masterList" onDrop={onDrop} setActiveItem={setActiveItem} />
                    )
                })}
            </div>
            <div className="dnd-items dragger-parent flex-horizental flex-center local-gap-1 h50 w100">
                { data?.map((list:{name:string, items:DNDItemtype[]})=>{
                    return(
                        <div className="flex-vertical local-gap-1">
                            <h6>{list.name}</h6>
                            {list.items.map((item:DNDItemtype)=>{
                                return(
                                    <ApiDragNDropItem id={item.id} name={item.name} onDrop={onDrop} parentName={list.name} setActiveItem={setActiveItem}/>
                                    
                                )
                            })}
                        </div>
                    )
                })

                }
            </div>
        </div>
    )
}
export default ApiDragNDrop;