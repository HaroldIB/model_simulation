class Background {
  constructor(imageSrc, canvas, context) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.canvas = canvas;
    this.context = context;
  }

  draw(simulationDistance) {
    const sourceX = 0;
    const sourceY = 0;
    const sourceWidth = simulationDistance;
    const sourceHeight = this.image.height;

    this.context.drawImage(
      this.image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}
