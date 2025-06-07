import { motion } from 'framer-motion'

const Circle = ({ radius, xPos, yPos, color = "blue", info, onHover, onLeave }) => {

  const handleClick = () => {
    console.log("\nCircle X: " + xPos, "\nCircle Y: " + yPos, "\nCircle radius: " + radius);
  }

  const toHex = (num) => {
    const hex = num.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const darken = (hex, amount) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const darkR = Math.max(0, r - amount);
    const darkG = Math.max(0, g - amount);
    const darkB = Math.max(0, b - amount);

    return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`
  }

  return (
    <>
    <motion.circle 
      cx={xPos}
      cy={yPos}
      r={radius}
      fill={darken(color, 50)}
      initial={{scale:0, transition:{duration: 0.1, ease:"easeOut"}}} 
      transform={`translate(${xPos}, ${yPos})`}
      animate={{scale:1}} 
      exit={{scale:0, transition:{duration: 0.3, ease:"easeOut"}}} 
      />

    <motion.circle
      cx={xPos}
      cy={yPos}
      r={radius * 0.97}
      fill={color}
      stroke={darken(color, 20)}
      onMouseEnter={() => onHover?.(info)}
      onMouseLeave={() => onLeave?.()}
      style={{ cursor: "pointer" }}
      onClick={handleClick}
      initial={{scale:0}} 
      transform={`translate(${xPos}, ${yPos})`}
      animate={{scale:1}} 
      exit={{scale:0}} 
      transition={{duration: 0.2, ease:"easeOut"}}
    />
    </>
  );
};

export default Circle;
