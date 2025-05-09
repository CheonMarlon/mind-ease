import React, { useState } from "react";
import ReactCanvasDraw from "react-canvas-draw";
import { SketchPicker } from "react-color"; // Import the color picker from react-color
import "./ArtSpace.css";
import NaviMain from "../NaviMain/NaviMain";

const ArtSpace = () => {
  const [brushSize, setBrushSize] = useState(25);
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [canvasRef, setCanvasRef] = useState(null);

  const handleClear = () => {
    if (canvasRef) {
      canvasRef.clear();
      setHistory([]);
    }
  };

  const handleUndo = () => {
    if (canvasRef) {
      const lastSnapshot = canvasRef.getSaveData();
      setHistory((prevHistory) => [...prevHistory, lastSnapshot]);
      canvasRef.undo();
    }
  };

  const handleDownload = () => {
    if (canvasRef) {
      const dataUrl = canvasRef.getDataURL();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "my_artwork.png";
      link.click();
    }
  };

  const handleSave = () => {
    if (canvasRef) {
      const drawingData = canvasRef.getSaveData();
      localStorage.setItem("savedDrawing", drawingData);
      alert("Drawing saved!");
    }
  };

  const handleLoad = () => {
    if (canvasRef) {
      const savedData = localStorage.getItem("savedDrawing");
      if (savedData) {
        canvasRef.loadSaveData(savedData);
      } else {
        alert("No saved drawing found.");
      }
    }
  };

  return (
    <div className="art-space-main">
      <div className="nav-main">
        <NaviMain/>
      </div>

      <div className="art-space-container">
        {/* Left Controls: Save, Undo, Download, Save/Load */}
        <div className="controls-left">
          <button onClick={handleClear}>
            <i className="fas fa-trash"></i>
          </button>
          <button onClick={handleUndo}>
            <i className="fas fa-undo"></i>
          </button>
          <button onClick={handleDownload}>
            <i className="fas fa-download"></i>
          </button>
          <button onClick={handleSave}>
            <i className="fas fa-save"></i>
          </button>
          <button onClick={handleLoad}>
            <i className="fas fa-folder-open"></i>
          </button>
        </div>

        {/* Canvas */}
        <ReactCanvasDraw
          ref={(canvas) => setCanvasRef(canvas)}
          brushColor={color}
          brushRadius={brushSize}
          canvasWidth={400}
          canvasHeight={400}
          hideGrid={true}
          lazyRadius={0}
          className="canvas-container"
        />

        {/* Right Controls: Color Picker, Brush Size */}
        <div className="controls-right">
          <div className="color-picker-container">
            <SketchPicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </div>

          <div className="brush-container">
            <button className="brush-button" onClick={() => setBrushSize(5)}>
              <div className="circle-size" style={{ width: "10px", height: "10px" }}></div>
            </button>
            <button className="brush-button" onClick={() => setBrushSize(7)}>
              <div className="circle-size" style={{ width: "12px", height: "12px" }}></div>
            </button>
            <button className="brush-button" onClick={() => setBrushSize(10)}>
              <div className="circle-size" style={{ width: "15px", height: "15px" }}></div>
            </button>
            <button className="brush-button" onClick={() => setBrushSize(12)}>
              <div className="circle-size" style={{ width: "20px", height: "20px" }}></div>
            </button>
            <button className="brush-button" onClick={() => setBrushSize(20)}>
              <div className="circle-size" style={{ width: "30px", height: "30px" }}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtSpace;
