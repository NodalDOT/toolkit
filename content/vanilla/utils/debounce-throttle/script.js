import { debounce } from "./debounce.js";
import { throttle } from "./throttle.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("paint");
  const context = canvas.getContext("2d");
  const hoverArea = document.getElementById("hover-area");
  const canvasTimeScale = 5 * 1000;
  const paintColors = ["#bbd", "#464", "#d88"];
  const totalLanes = paintColors.length;
  const leftMargin = 100;
  let startTime = null;

  const resizeCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  const flush = () => {
    const laneHeight = canvas.height / totalLanes;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "200 18px Roboto, Helvetica, Arial";

    context.fillStyle = paintColors[0];
    context.fillText("Regular", 0, laneHeight * 0.5);

    context.fillStyle = paintColors[1];
    context.fillText("Debounce", 0, laneHeight * 1.5);

    context.fillStyle = paintColors[2];
    context.fillText("Throttle", 0, laneHeight * 2.5);
  };

  const getTimeDiff = () => {
    const time = Date.now();

    if (!startTime) {
      startTime = time;
    }

    return time - startTime;
  };

  const paintRect = (lane, time) => {
    let laneTime = time;

    if (laneTime > canvasTimeScale) {
      startTime += laneTime;
      laneTime = 0;
      flush();
    }

    context.fillStyle = paintColors[lane];

    const x =
      ((canvas.width - leftMargin) / canvasTimeScale) * laneTime + leftMargin;
    const y = (canvas.height / totalLanes) * lane;
    const height = canvas.height / totalLanes;

    context.fillRect(x, y, 1, height);
  };

  const regularHandler = () => {
    paintRect(0, getTimeDiff());
  };

  const debounceHandler = () => {
    paintRect(1, getTimeDiff());
  };

  const throttleHandler = () => {
    paintRect(2, getTimeDiff());
  };

  resizeCanvas();
  flush();

  hoverArea.addEventListener("mousemove", regularHandler);
  hoverArea.addEventListener("mousemove", debounce(debounceHandler, 100));
  hoverArea.addEventListener("mousemove", throttle(throttleHandler, 100));

  window.addEventListener("resize", () => {
    resizeCanvas();
    flush();
  });
});
