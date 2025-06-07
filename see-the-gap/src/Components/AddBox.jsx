import {useState} from 'react'

function AddBox({template, circles, setCircles, viewBox, setViewBox, max}){

    const [number, setNumber] = useState(0);

    const handleAdd = () => {
        if(number < max){
            const newId = Math.max(0, ...circles.map(c => c.id)) + 1
            setCircles([...circles, {id: newId, ...template}])
            setNumber(number+1);
        }
    }

    const handleRemove = () => {
        if(number > 0){
            const index = circles.findIndex(c => c.title === template.title)

            if(index !== -1){
                const newCircles = [...circles]
                newCircles.splice(index, 1)
                setCircles(newCircles)
                setNumber(number-1);
            }
        }
    }

    //Zoom to one of this type of circle
    const handleFind = () => {
        const circle = circles.find(c => c.title === template.title);

        if(circle){
            const newX = (circle.x - circle.radius*1.2);
            const newY = (circle.y - circle.radius*1.2);
            const newW = circle.radius*2.5;
            const newH = circle.radius*2.5;

            animateViewBox(viewBox, {x: newX, y:newY, w:newW, h:newH}, setViewBox)
        }
    }

    //Animate the zoom using manual interpolation
    function animateViewBox(from, to, setViewBox){
        const duration = 500; //ms
        const start = performance.now();

        function step(now) {

            const t = Math.min((now - start) / duration, 1);
            const eased = t * (2-t);

            setViewBox(prev => ({...prev, 
                x: from.x + (to.x - from.x) * eased,
                y: from.y + (to.y - from.y) * eased,
                w: from.w + (to.w - from.w) * eased,
                h: from.h + (to.h - from.h) * eased,
            }));

            if(t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    return(
        <div className="addBox">
            <span>{template.title} <span style={{fontSize:"10px", color: "gray", margin:"0px"}}> {number} / {max}</span> </span>
            <p style={{fontSize:"10px", color: "gray", margin:"0px"}}> { new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: template.money % 1 === 0 ? 0 : 2, maximumFractionDigits: 2}).format(template.money) } </p>
            

            <div className="addSubContainer">
                <button className="addSubButton" onClick={handleAdd}>+</button>
                <button className="addSubButton" onClick={handleRemove}>-</button>
                <button className="addSubButton" style={{fontSize:"12px"}} onClick={handleFind}>Find</button>
            </div>
        </div>
    )
}

export default AddBox