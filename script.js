const nails = [
  document.getElementById("nail1"),
  document.getElementById("nail2"),
  document.getElementById("nail3"),
  document.getElementById("nail4"),
  document.getElementById("nail5")
];

let selectedColor = null;
let selectedSticker = null;

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
    swatch.onclick = () => selectedColor = color;
    colorContainer.appendChild(swatch);
  });

  const stickerContainer = document.getElementById("stickers");
  stickers.forEach(sticker => {
    const icon = document.createElement("img");
    icon.src = `assets/stickers/${sticker}.png`;
    icon.alt = sticker;
    icon.title = sticker;
    icon.onclick = () => selectedSticker = sticker;
    stickerContainer.appendChild(icon);
  });
}

function paintNail(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (selectedColor) {
    const img = new Image();
    img.src = `assets/colors/${selectedColor}.png`;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  if (selectedSticker) {
    const sticker = new Image();
    sticker.src = `assets/stickers/${selectedSticker}.png`;
    sticker.onload = () => ctx.drawImage(sticker, 5, 5, 30, 30);
  }
}

nails.forEach(canvas => {
  canvas.width = 40;
  canvas.height = 40;
  canvas.onclick = () => paintNail(canvas);
});

function resetNails() {
  nails.forEach(canvas => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  selectedColor = null;
  selectedSticker = null;
}


loadPalette();
