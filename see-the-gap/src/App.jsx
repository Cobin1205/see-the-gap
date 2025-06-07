import { useState, useMemo } from 'react'
import ZoomableSVG from './Components/ZoomableSVG'
import Circle from "./Components/Circle"
import Card from "./Components/Card"
import Sidebar from "./Components/Sidebar"
import AddBox from "./Components/AddBox"
import { AnimatePresence } from 'framer-motion'
import circleData from "./circleData.json"

function App() {
  const [hoveredInfo, setHoveredInfo] = useState(null)
  const [showCard, setShowCard] = useState(false)

  const handleCircleHover = (info) => {
    setHoveredInfo(info)
    setShowCard(true)
  }

  const handleCircleLeave = () =>{
    setShowCard(false)
  }

  //Dynamic Collection of Circles
  const [circles, setCircles] = useState([])

  //Sort circles by descending size
  const sortedCircles = useMemo(() => [...circles].sort((a, b) => b.money - a.money), [circles])

  const centerX = 0
  const centerY = 0
  const scale = 0.05

  // Create a list of objects containing fields for each circle's: 
  // x, y radius
  const positionedCircles = useMemo(() => {
    if(sortedCircles.length == 0) return [];

    //get largest circle and place it in the center

    // get list of rest of circles to place overtop main circle
    const placed = [];

    //Finds the distance between 2 points
    function dist(x1, y1, x2, y2){
      return Math.hypot(x2-x1, y2-y1);
    }

    // Takes in info for a circle, compares it to every other circle
    // that has already been placed 
    // return true if there is any overlap
    function hasOverlap(x, y, r, placed){
      for(const c of placed){
        if (dist(x, y, c.x, c.y) < r + c.radius) {
          return true;
        }
      }
      return false;
    }

    //precalculate the radii of rest
    const restWithRadii = sortedCircles.map(c => ({
      ...c,
      radius: Math.sqrt(c.money) * scale,
    }));

    //Main circle ready to render
    return[

      //Calculate x, y positions for each circle
      ...restWithRadii.map((circle, i) => {
        const { radius } = circle;

        //Initialize for spiral pack
        let angle = 0;
        let radiusFromCenter=0;
        if(i!==0){radiusFromCenter = restWithRadii[0].radius}
        const step = radius * 0.5;
        let newX = 0;
        let newY = 0;

        // Search for placement using the Spiral Packing algorithm
        while(true){
          newX = radiusFromCenter * Math.cos(angle);
          newY = radiusFromCenter * Math.sin(angle);

          if(!hasOverlap(newX, newY, radius, placed)){
            placed.push({x: newX, y: newY, radius});
            break;
          }

          angle += 0.2;
          radiusFromCenter += step*0.001;
        }

        //Circle ready to render
        return {
          ...circle,
          x: newX,
          y: newY,
          radius,
        };
      }),
    ];
  }, [sortedCircles]);

  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 100000, h: 100000 })

  return (
    <>
    <div style={{position: "relative", width:"100vw", height: "100vh"}}>
      <ZoomableSVG viewBox={viewBox} setViewBox={setViewBox}>
        <AnimatePresence>
        {positionedCircles.map(circle => (
          !isNaN(circle.x) && !isNaN(circle.y) && !isNaN(circle.radius) &&
          <Circle
          key={circle.id}
          xPos={circle.x}
          yPos={circle.y}
          radius={circle.radius}
          color={circle.color}
          info={{title: circle.title, money: circle.money}}
          onHover={handleCircleHover}
          onLeave={handleCircleLeave}/>
        ))}
        </AnimatePresence>
      </ZoomableSVG>

      <Sidebar>
        {circleData.map((data, i) => {
          return(
            <AddBox 
            template={{title:data.title, money: data.money, color: data.color}}
            circles={positionedCircles}
            setCircles={setCircles}
            viewBox={viewBox} setViewBox={setViewBox}
            max={data.max}/>
          );
        })}
      </Sidebar>

      {showCard && <Card info={hoveredInfo}/>}
    </div>
    </>
  )
}

export default App
