import {useState, useEffect} from 'react'

function Card({info}){
    const [position, setPosition] = useState({x:0, y:0});

    useEffect(() => {

        const handleMouseMove = (event) => {
            setPosition({x: event.clientX, y: event.clientY})
        }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
        window.removeEventListener('mousemove', handleMouseMove)
    }

    }, [])

    return(
        <div style = {{
            position: "absolute",
            top: position.y,
            left: position.x,
            minWidth: "100px",
            minHeight: "50px",
            backgroundColor: "white",
            zIndex: 1000,
            pointerEvents: "none",
            borderRadius: "5px",
            padding: "8px",
            lineHeight: 1.5,
        }}>
            <p style={{margin: "0px"}}> <strong> {info.title} </strong> </p>
            <p style={{margin: "0px"}}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: info.money % 1 === 0 ? 0 : 2, maximumFractionDigits: 2}).format(info.money)}</p>
        </div>
    )
}

export default Card