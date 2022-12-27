import { Box, Button, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";

function Christmas() {
  const canvasRef = useRef(null);
  const [toggle, setToggle] = useState(true);
  let snowOff = null;
  let snowOn = null;
  let animate = 0;
  useEffect(() => {
    canvasRef.current.width = innerWidth;
    canvasRef.current.height = innerHeight;

    window.addEventListener("resize", () => {
      canvasRef.current.width = innerWidth;
      canvasRef.current.height = innerHeight;
    });
    const ctx = canvasRef.current.getContext("2d");

    let snows = [];
    const snowCount = 1;
    // for (let i = 0; i < snowCount; i++) {
    //   snows.push({
    //     id: i,
    //     start: false,
    //     end: false,
    //     isFalling: false,
    //     speed: Math.random() * 10,
    //     x: 0,
    //     y: 0,
    //     color: 0x000000,
    //   });
    // }
    // console.log(snows);

    snowOff = (animate) => {
      cancelAnimationFrame(animate);
    };
    snowOn = () => {
      return requestAnimationFrame(animation);
    };

    animate = snowOn(animation);
    const snowLimit = 20;
    const isDoneSnow = [];
    let critialArea = false;
    const frame = 30;
    function animation(time) {
      time *= 1000;
      const currentTime = time;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (
        !critialArea &&
        currentTime % frame === 0 &&
        snows.length < snowLimit
      ) {
        snows.push({
          id: snows.length,
          start: false,
          end: false,
          isFalling: false,
          speed: Math.random() * 1.5 + 0.5,
          x: Math.random() * canvasRef.current.width,
          y: 0,
          color: 0x000000,
          size: Math.random() * 5 + 5,
        });
        critialArea = true;
      }

      for (let i = 0; i < snows.length; i++) {
        const snow = snows[i];
        if (snow.end) continue;
        if (!snow.isFalling) {
          Object.assign(snow, {
            isFalling: true,
            start: true,
          });
        }

        Object.assign(snow, {
          y: snow.y + snow.speed,
        });

        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.size, 0, 4 * Math.PI, false);
        ctx.fill();
        ctx.filter = "drop-shadow(0 0 0.5rem #000000b5)";
        ctx.fillStyle = "#ffffff";
        // ctx.filter = 'blur(4px)';

        if (snow.y > canvasRef.current.height + snow.size) {
          Object.assign(snow, {
            start: false,
            isFalling: false,
            end: true,
          });
          snows.splice(i, 1);
        }
      }
      // snows = snows.filter((snow) => snow.isFalling);
      critialArea = false;
      animate = requestAnimationFrame(animation);
    }
    return () => {
      snowOff(animate);
    };
  }, [toggle]);

  return (
    <Box>
      <Box
        component={"canvas"}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: toggle ? "block" : "none",
        }}
        ref={canvasRef}
      />
			<Typography
        sx={{
          position: "fixed",
          bottom: "3rem",
          left: "2rem",
          color: "red",
          fontStyle: "italic",
        }}>
        Merry Christmas
      </Typography>
      <Button
        sx={{
          position: "fixed",
          bottom: "1rem",
          left: "2rem",
        }}
        onClick={() => {
          // if (toggle) {
          //   animate = snowOn();
          // } else {
          //   snowOff(animate);
          // }
          setToggle(!toggle);
        }}>
        snow on/off
      </Button>
    </Box>
  );
}

export default Christmas;
