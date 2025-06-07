import { useRef, useState, useEffect } from "react";

const ZoomableSVG = ({ children, viewBox, setViewBox }) => {
  const svgRef = useRef();

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewBoxStart = useRef({ ...viewBox });

  // Moved out of JSX to avoid React's passive wheel handling
  const handleWheel = (e) => {
    e.preventDefault();

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const zoomFactor = 1.05;
    const scale = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const svgX = (mouseX / rect.width) * viewBox.w + viewBox.x;
    const svgY = (mouseY / rect.height) * viewBox.h + viewBox.y;

    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;

    const newX = svgX - ((svgX - viewBox.x) * scale);
    const newY = svgY - ((svgY - viewBox.y) * scale);

    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Attach manually with passive: false
    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, [viewBox]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    viewBoxStart.current = { ...viewBox };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const moveX = (dx / rect.width) * viewBox.w;
    const moveY = (dy / rect.height) * viewBox.h;

    setViewBox({
      ...viewBox,
      x: viewBoxStart.current.x - moveX,
      y: viewBoxStart.current.y - moveY,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <svg
      ref={svgRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      width="100vw"
      height="100vh"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      style={{
        cursor: "default",
        userSelect: "none",
        backgroundColor: "#222222",
        border: "1px solid #ccc",
      }}
    >
      {children}
    </svg>
  );
};

export default ZoomableSVG;
