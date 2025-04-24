import { useEffect, useRef } from "react";

function useDragger(id:string) {
    const isClicked = useRef<boolean>(false)
    const coorsRef = useRef<{startX:number, startY:number,  lastX:number, lastY:number}>({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })

    useEffect(()=>{
        const target = document.getElementById(id)
        if (!target) {
            console.error("no target");
            return
        }
        const parent = target.parentElement
        if (!parent) {
            console.error("no parent");
            return
        }
        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true
            coorsRef.current.startX = e.clientX
            coorsRef.current.startY = e.clientY
        }
        const onMouseUp = () => {
            isClicked.current = false
            coorsRef.current.lastX = target.offsetLeft
            coorsRef.current.lastY = target.offsetTop
        }
        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current) return;
            const nextX = e.clientX - coorsRef.current.startX + coorsRef.current.lastX
            const nextY = e.clientY - coorsRef.current.startY + coorsRef.current.lastY
            target.style.left = `${nextX}px`
            target.style.top = `${nextY}px`
        }
        target.addEventListener('mousedown', onMouseDown)
        target.addEventListener('mouseup', onMouseUp)
        parent.addEventListener('mousemove', onMouseMove)
        parent.addEventListener('mouseleave', onMouseUp)
        
        const cleanUp = () => {
            target.removeEventListener('mousedown', onMouseDown)
            target.removeEventListener('mouseup', onMouseUp)
            parent.removeEventListener('mousemove', onMouseMove)
            parent.removeEventListener('mouseleave', onMouseUp)
        }
        return cleanUp();

    }, [id])
}
export default useDragger;