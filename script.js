const nails = [
  { canvas: document.getElementById("nail1"), coords: { x: 50, y: 60 }, shape: 'thumb' },
  { canvas: document.getElementById("nail2"), coords: { x: 100, y: 50 }, shape: 'finger' },
  { canvas: document.getElementById("nail3"), coords: { x: 150, y: 40 }, shape: 'finger' },
  { canvas: document.getElementById("nail4"), coords: { x: 200, y: 50 }, shape: 'finger' },
  { canvas: document.getElementById("nail5"), coords: { x: 250, y: 60 }, shape: 'pinky' }
];
const zoomCanvas = document.getElementById("zoom");
let selectedColor = null;
let selectedSticker = null;
let selectedNail = null;
let viewMode = 'hand';

function loadPalette() {
  const colors = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white", "brown",
    "gold", "silver", "bronze", "rose-gold", "chrome",
    "baby-blue", "mint", "lavender", "peach", "cream",
    "glitter-red", "glitter-pink", "holo", "neon-green", "neon-purple"
  ];
  const stickers = ["heart", "star", "glitter", "flower", "smile"];

  const colorContainer = document.getElementById("colors");
  colors.forEach(color => {
    const swatch = document.createElement("div");
    swatch.className = "swatch color";
    swatch.style.background = color.includes("glitter") || color.includes("neon") || color.includes("holo")
      ? `linear-gradient(45deg, ${color.replace("-", "")}, white)`
      : color.replace("-", "");
    swatch.title = color;
    swatch.onclick = () => {
      selectedColor = color;
      selectedSticker = null;
      document.querySelectorAll(".swatch").forEach(s => s.style.borderColor = "transparent");
      swatch.style.borderColor = "#d81b60";
      if (selectedNail) paintNail(selectedNail);
    };
    colorContainer.appendChild(swatch);
  });

  const stickerContainer = document.getElementById("stickers");
  stickers.forEach(sticker => {
    const icon = document.createElement("canvas");
    icon.width = 40;
    icon.height = 40;
    const ctx = icon.getContext("2d");
    drawSticker(ctx, sticker);
    icon.className = "swatch";
    icon.title = sticker;
    icon.onclick = () => {
      selectedSticker = sticker;
      selectedColor = null;
      document.querySelectorAll(".swatch").forEach(s => s.style.borderColor = "transparent");
      icon.style.borderColor = "#d81b60";
      if (selectedNail) paintNail(selectedNail);
    };
    stickerContainer.appendChild(icon);
  });
}

function drawSticker(ctx, sticker) {
  ctx.fillStyle = sticker === "glitter" ? "gold" : "black";
  ctx.beginPath();
  switch (sticker) {
    case "heart":
      ctx.moveTo(20, 10);
      ctx.bezierCurveTo(10, 0, 0, 10, 10, 25);
      ctx.bezierCurveTo(20, 40, 20, 40, 30, 25);
      ctx.bezierCurveTo(40, 10, 30, 0, 20, 10);
      break;
    case "star":
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(20 + 15 * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2), 20 + 15 * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2));
        ctx.lineTo(20 + 7 * Math.cos((Math.PI * 2 * (i + 0.5)) / 5 - Math.PI / 2), 20 + 7 * Math.sin((Math.PI * 2 * (i + 0.5)) / 5 - Math.PI / 2));
      }
      break;
    case "glitter":
      for (let i = 0; i < 10; i++) {
        ctx.arc(10 + Math.random() * 20, 10 + Math.random() * 20, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    case "flower":
      ctx.arc(20, 20, 10, 0, Math.PI * 2);
      for (let i = 0; i < 6; i++) {
        ctx.arc(20 + 10 * Math.cos((Math.PI * 2 * i) / 6), 20 + 10 * Math.sin((Math.PI * 2 * i) / 6), 5, 0, Math.PI * 2);
      }
      break;
    case "smile":
      ctx.arc(20, 20, 15, 0, Math.PI * 2);
      ctx.moveTo(15, 15);
      ctx.arc(15, 15, 3, 0, Math.PI * 2);
      ctx.moveTo(25, 15);
      ctx.arc(25, 15, 3, 0, Math.PI * 2);
      ctx.moveTo(25, 25);
      ctx.arc(20, 25, 5, 0, Math.PI);
      break;
  }
  ctx.fill();
}

function drawNailShape(ctx, shape) {
  ctx.beginPath();
  if (shape === 'thumb') {
    ctx.moveTo(12, 40);
    ctx.quadraticCurveTo(0, 20, 12, 0);
    ctx.lineTo(28, 0);
    ctx.quadraticCurveTo(40, 20, 28, 40);
  } else if (shape === 'pinky') {
    ctx.moveTo(15, 40);
    ctx.quadraticCurveTo(5, 15, 15, 0);
    ctx.lineTo(25, 0);
    ctx.quadraticCurveTo(35, 15, 25, 40);
  } else {
    ctx.moveTo(10, 40);
    ctx.quadraticCurveTo(0, 20, 10, 0);
    ctx.lineTo(30, 0);
    ctx.quadraticCurveTo(40, 20, 30, 40);
  }
  ctx.closePath();
  ctx.clip();
}

function paintNail(nailObj) {
  const canvas = nailObj.canvas;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (viewMode === 'finger' && nailObj !== selectedNail) return;

  ctx.save();
  drawNailShape(ctx, nailObj.shape);
  if (selectedColor) {
    ctx.fillStyle = selectedColor.includes("glitter") || selectedColor.includes("neon") || selectedColor.includes("holo")
      ? `linear-gradient(45deg, ${selectedColor.replace("-", "")}, white)`
      : selectedColor.replace("-", "");
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.ellipse(20, 10, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (selectedSticker) {
    ctx.save();
    drawSticker(ctx, selectedSticker);
    ctx.restore();
    if (viewMode === 'finger' && nailObj === selectedNail) paintZoom();
  } else if (viewMode === 'finger' && nailObj === selectedNail) {
    paintZoom();
  }
  ctx.restore();
}

function paintZoom() {
  const ctx = zoomCanvas.getContext("2d");
  ctx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
  ctx.save();
  ctx.scale(4, 4);
  drawNailShape(ctx, selectedNail.shape);
  if (selectedColor) {
    ctx.fillStyle = selectedColor.includes("glitter") || selectedColor.includes("neon") || selectedColor.includes("holo")
      ? `linear-gradient(45deg, ${selectedColor.replace("-", "")}, white)`
      : selectedColor.replace("-", "");
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.ellipse(20, 10, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (selectedSticker) {
    drawSticker(ctx, selectedSticker);
  }
  ctx.restore();
}

nails.forEach(nailObj => {
  nailObj.canvas.width = 40;
  nailObj.canvas.height = 40;
  nailObj.canvas.onclick = () => {
    selectedNail = nailObj;
    paintNail(nailObj);
    if (viewMode === 'finger') showFinger();
  };
});

function showHand() {
  viewMode = 'hand';
  document.querySelector(".hand img").style.display = "block";
  zoomCanvas.style.display = "none";
  nails.forEach(nailObj => nailObj.canvas.style.display = "block");
}

function showFinger() {
  if (!selectedNail) {
    alert("Please select a nail first!");
    return;
  }
  viewMode = 'finger';
  document.querySelector(".hand img").style.display = "none";
  nails.forEach(nailObj => nailObj.canvas.style.display = nailObj === selectedNail ? "block" : "none");
  zoomCanvas.style.display = "block";
  paintZoom();
}

function clearNail() {
  if (!selectedNail) {
    alert("Please select a nail first!");
    return;
  }
  const ctx = selectedNail.canvas.getContext("2d");
  ctx.clearRect(0, 0, selectedNail.canvas.width, selectedNail.canvas.height);
  if (viewMode === 'finger') paintZoom();
}

function resetNails() {
  nails.forEach(nailObj => {
    const ctx = nailObj.canvas.getContext("2d");
    ctx.clearRect(0, 0, nailObj.canvas.width, nailObj.canvas.height);
  });
  selectedColor = null;
  selectedSticker = null;
  selectedNail = null;
  document.querySelectorAll(".swatch").forEach(s => s.style.borderColor = "transparent");
  if (viewMode === 'finger') showHand();
}

function saveDesign() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 300;
  tempCanvas.height = 300;
  const ctx = tempCanvas.getContext("2d");
  const handImg = document.querySelector(".hand img");
  ctx.drawImage(handImg, 0, 0, 300, 300);
  nails.forEach(nailObj => {
    ctx.drawImage(nailObj.canvas, nailObj.coords.x, nailObj.coords.y);
  });
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText("Nail Studio Express - Designed for [Wife’s Name]", 10, 290);
  const link = document.createElement("a");
  link.download = "nail-design.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
}

loadPalette();
zoomCanvas.width = 160;
zoomCanvas.height = 160;
showHand();
