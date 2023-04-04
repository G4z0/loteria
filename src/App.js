import React, { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import './App.css';

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [userValues, setUserValues] = useState([]);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const wheelSize = 2200;
  const segments = userValues.length > 0 ? userValues.length : 3;
  const segmentAngle = (2 * Math.PI) / segments;
  const wheelRadius = wheelSize / 2;

  const handleUserValuesSubmit = (event) => {
    event.preventDefault();
    const inputValues = event.target.elements.userInput.value
      .split(',')
      .map((value) => value.trim());
    setUserValues(inputValues);
  };

  
  const bind = useDrag(({ down }) => {
    if (!down) {
      setSpinning(true);
      const randomSpins = Math.floor(Math.random() * 5 + 1) * 360;
      const randomStop = Math.floor(Math.random() * 360);
      const totalRotation = angle + randomSpins + randomStop;
      api.start({
        x: totalRotation,
        from: { x: angle },
        config: { mass: 1, tension: 50, friction: 60 },
        onRest: () => setSpinning(false),
      });
      setAngle(totalRotation);
    }
  });
  const colors = ['#f1c40f', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12'];

  const createSegments = () => {
    const segs = [];
    for (let i = 0; i < segments; i++) {
      segs.push(
        <g key={i}>
          <path
            d={`M ${wheelRadius} ${wheelRadius} L ${wheelRadius} 0 A ${wheelRadius} ${wheelRadius} 0 0 1 ${
              wheelRadius + wheelRadius * Math.sin(segmentAngle)
            } ${wheelRadius - wheelRadius * Math.cos(segmentAngle)} Z`}
            fill={colors[i % colors.length]}
            transform={`rotate(${(i * 360) / segments} ${wheelRadius} ${wheelRadius})`}
          />
         <animated.g
            transform={x.to(
              (val) => `rotate(${(i * 360) / segments} ${wheelRadius} ${wheelRadius}) rotate(${-val}deg ${wheelRadius} ${wheelRadius})`
            )}
            key={i}
          >
            <text
              x={wheelRadius + wheelRadius * 0.65 * Math.sin((i + 0.5) * segmentAngle)}
              y={wheelRadius - wheelRadius * 0.65 * Math.cos((i + 0.5) * segmentAngle)}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#333333"
              fontSize="84"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
            >
              {userValues[i]}
            </text>
          </animated.g>
        </g>
      );
    }
    return segs;
  };
  
  return (
    <div className="App">
    <h1 style={{ marginBottom: '2rem' }}>Whats gonna F*^$<br></br> you up Today</h1>
    <form style={{ paddingTop: '2rem' }} onSubmit={handleUserValuesSubmit}>
      <label htmlFor="userInput">Enter values (separated by commas): </label>
      <input type="text" name="userInput" id="userInput" required />
      <button type="submit">Update Wheel</button>
    </form>
    <div className="wheel-container" {...bind()}>
      <div className="marker" />
      <animated.svg
        className="wheel"
        viewBox={`0 0 ${wheelSize} ${wheelSize}`}
        style={{
          transform: x.to((val) => `rotate(${val}deg)`),
        }}
      >
        {createSegments()}
      </animated.svg>
    </div>
  </div>
  
  );
};

export default App;
