import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import useDebounce from "../hooks/useDebounce";

const Toolbar = () => {

    const changeColor = useDebounce( (e) => {
        if(toolState.tool) {
            toolState.setFillColor(e.target.value);
            //toolState.setStrokeColor(e.target.value);
        }
    }, 100)

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionid + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const serverUndo = () => {
        //canvasState.undo()
        canvasState.socket.send(JSON.stringify({
            method: 'undo',
            id: canvasState.sessionid,
            undoList: canvasState.undoList,
            redoList: canvasState.redoList
        }));

    }

    const serverRedo = () => {
        //canvasState.redo()
        canvasState.socket.send(JSON.stringify({
            method: 'redo',
            id: canvasState.sessionid,
            undoList: canvasState.undoList,
            redoList: canvasState.redoList
        }));

    }

    return (
        <div className="toolbar">
            <button
                className='toolbar__button brush'
                onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}
            />
            <button
                className='toolbar__button rect'
                onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}
            />
            <button
                className='toolbar__button circle'
                onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}
            />
            <button
                className='toolbar__button eraser'
                onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))}
            />
            <button
                className='toolbar__button line'
                onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))}
            />
            <input
                onChange={e => changeColor(e)}
                type='color'
                className='toolbar__button color'
            />
            <button
                onClick={() => serverUndo()}
                className='toolbar__button undo'
            />
            <button
                onClick={() => serverRedo()}
                className='toolbar__button redo'
            />
            <button className='toolbar__button save'
                    onClick={() => download()}
            />
        </div>
    );
};

export default Toolbar;