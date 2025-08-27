const nails = [
  { canvas: document.getElementById("nail1"), coords: { x: 50, y: 60 } },
  { canvas: document.getElementById("nail2"), coords: { x: 100, y: 50 } },
  { canvas: document.getElementById("nail3"), coords: { x: 150, y: 40 } },
  { canvas: document.getElementById("nail4"), coords: { x: 200, y: 50 } },
  { canvas: document.getElementById("nail5"), coords: { x: 250, y: 60 } }
];
const zoomCanvas = document.getElementById("zoom");
let selectedColor = null;
let selectedSticker = null;
let selectedNail = null;
let viewMode = 'hand'; // 'hand' or 'finger'

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
    const swatch = document.createElement("img");
    swatch.src = `assets/colors/${color}.png`;
    swatch.alt = color;
    swatch.title = color;
    swatch.className = "swatch";
    swatch.onerror = () => console.error(`Failed to load color: ${color}.png`);
    swatch.onclick = () => {
      selectedColor = color;
      selectedSticker = null;
      document.querySelectorAll(".swatch").forEach(s => s.style.borderColor = "transparent");
      swatch.style.borderColor = "#d81b60";
    };
    colorContainer.appendChild(swatch);
  });

  const stickerContainer = document.getElementById("stickers");
  stickers.forEach(sticker => {
    const icon = document.createElement("img");
    icon.src = `assets/stickers/${sticker}.png`;
    icon.alt = sticker;
    icon.title = sticker;
    icon.className = "swatch";
    icon.onerror = () => console.error(`Failed to load sticker: ${sticker}.png`);
    icon.onclick = () => {
      selectedSticker = sticker;
      selectedColor = null;
      document.querySelectorAll(".swatch").forEach(s => s.style.borderColor = "transparent");
      icon.style.borderColor = "#d81b60";
    };
    stickerContainer.appendChild(icon);
  });
}

function drawNailShape(ctx) {
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.quadraticCurveTo(0, 20, 10, 0);
  ctx.lineTo(30, 0);
  ctx.quadraticCurveTo(40, 20, 30, 40);
  ctx.closePath();
  ctx.clip();
}

function paintNail(nailObj) {
  const canvas = nailObj.canvas;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (viewMode === 'finger' && nailObj !== selectedNail) return;

  ctx.save();
  drawNailShape(ctx);
  if (selectedColor) {
    const img = new Image();
    img.src = `assets/colors/${selectedColor}.png`;
    img.onerror = () => console.error(`Failed to load color image: ${selectedColor}.png`);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (viewMode === 'finger' && nailObj === selectedNail) paintZoom();
    };
  }
  if (selectedSticker) {
    const sticker = new Image();
    sticker.src = `assets/stickers/${selectedSticker}.png`;
    sticker.onerror = () => console.error(`Failed to load sticker: ${selectedSticker}.png`);
    sticker.onload = () => {
      ctx.drawImage(sticker, 5, 5, 30, 30);
      if (viewMode === 'finger' && nailObj === selectedNail) paintZoom();
    };
  }
  ctx.restore();
}

function paintZoom() {
  const ctx = zoomCanvas.getContext("2d");
  ctx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
  ctx.save();
  ctx.scale(4, 4); // Zoom effect
  drawNailShape(ctx);
  if (selectedColor) {
    const img = new Image();
    img.src = `assets/colors/${selectedColor}.png`;
    img.onload = () => ctx.drawImage(img, 0, 0, 40, 40);
  }
  if (selectedSticker) {
    const sticker = new Image();
    sticker.src = `assets/stickers/${selectedSticker}.png`;
    sticker.onload = () => ctx.drawImage(sticker, 5, 5, 30, 30);
  }
  ctx.restore();
}

nails.forEach(nailObj => {
  nailObj.canvas.width = 40;
  nailObj.canvas.height = 40;
  nailObj.canvas.onclick = () => {
    selectedNail = nailObj;
    if (viewMode === 'finger') showFinger();
    else paintNail(nailObj);
  };
});

function showHand() {
  viewMode = 'hand';
  document.querySelector(".hand img").style.display = "block";
  zoomCanvas.style.display = "none";
  nails.forEach(nailObj => nailObj.canvas.style.display = "block");
}

function showFinger() {
  if (!selectedNail) return;
  viewMode = 'finger';
  document.querySelector(".hand img").style.display = "none";
  nails.forEach(nailObj => nailObj.canvas.style.display = nailObj === selectedNail ? "block" : "none");
  zoomCanvas.style.display = "block";
  paintZoom();
}

function clearNail() {
  if (selectedNail) {
    const ctx = selectedNail.canvas.getContext("2d");
    ctx.clearRect(0, 0, selectedNail.canvas.width, selectedNail.canvas.height);
    if (viewMode === 'finger') paintZoom();
  }
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
  const link = document.createElement("a");
  link.download = "nail-design.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
}

loadPalette();
zoomCanvas.width = 160;
zoomCanvas.height = 160;
showHand();
