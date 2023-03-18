function getDrawingPathLength(path) {
  let length = 0;
  const points = path.path;

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    length += Math.sqrt(
      Math.pow(currPoint[1] - prevPoint[1], 2) +
        Math.pow(currPoint[2] - prevPoint[2], 2)
    );
  }

  return length;
}

function getPerfectLineLength(start, end) {
  return Math.sqrt(
    Math.pow(end.left - start.left, 2) + Math.pow(end.top - start.top, 2)
  );
}

function updateScoreDisplay(score) {
  const scoreDisplay = document.getElementById("scoreDisplay");
  scoreDisplay.textContent = `Score: ${score.toFixed(2)} / 100`;
}

function isPathThroughPoints(path, point1, point2, radius) {
  const points = path.path;

  let throughPoint1 = false;
  let throughPoint2 = false;

  for (const point of points) {
    if (
      Math.sqrt(
        Math.pow(point1.left - point[1], 2) + Math.pow(point1.top - point[2], 2)
      ) <= radius
    ) {
      throughPoint1 = true;
    }
    if (
      Math.sqrt(
        Math.pow(point2.left - point[1], 2) + Math.pow(point2.top - point[2], 2)
      ) <= radius
    ) {
      throughPoint2 = true;
    }
    if (throughPoint1 && throughPoint2) {
      return true;
    }
  }
  return false;
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas = new fabric.Canvas("drawingCanvas", {
    isDrawingMode: true,
  });

  canvas.on("path:created", function () {
    canvas.calcOffset();
  });

  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = "#00f2ea";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const distance = 300;
  const randomAngle = Math.random() * 2 * Math.PI;

  const startX = centerX - (distance / 2) * Math.cos(randomAngle);
  const startY = centerY - (distance / 2) * Math.sin(randomAngle);
  const endX = centerX + (distance / 2) * Math.cos(randomAngle);
  const endY = centerY + (distance / 2) * Math.sin(randomAngle);

  const startCircle = new fabric.Circle({
    left: startX,
    top: startY,
    strokeWidth: 5,
    radius: 10,
    fill: "#ff0050",
    stroke: "#ff0050",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
  });

  const endCircle = new fabric.Circle({
    left: endX,
    top: endY,
    strokeWidth: 5,
    radius: 10,
    fill: "#ff0050",
    stroke: "#ff0050",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
  });

  canvas.add(startCircle);
  canvas.add(endCircle);

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "scoreDisplay";
  scoreDisplay.style.fontSize = "24px";
  scoreDisplay.style.fontWeight = "bold";
  document.body.appendChild(scoreDisplay);

  const instructions = document.createElement("div");
  instructions.id = "instructions";
  instructions.innerHTML =
    "Draw a line between two points. Your score depends on the straightness of the line.";
  document.body.appendChild(instructions);

  canvas.on("path:created", function (e) {
    const pathLength = getDrawingPathLength(e.path);
    const perfectLineLength = getPerfectLineLength(startCircle, endCircle);
    const throughStartOrEnd = isPathThroughPoints(
      e.path,
      startCircle,
      endCircle,
      startCircle.radius
    );

    if (throughStartOrEnd) {
      const score = Math.min((100 * perfectLineLength) / pathLength, 100);
      updateScoreDisplay(score);
    } else {
      updateScoreDisplay(0);
    }
  });

  canvas.on("mouse:down", function (e) {
    const objects = canvas.getObjects("path");
    canvas.remove(objects[0]);
  });

  canvas.on("mouse:up", function (e) {
    const objects = canvas.getObjects("path");
    if (objects.length > 1) {
      canvas.remove(objects[0]);
    }
  });
});
