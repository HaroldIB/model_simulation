class Ruler {
  constructor(distance, height, startY, offsetX, totalWidth) {
    this.distance = distance; // Cambia 'distance' a 'this.distance'
    this.marks = 10;
    this.height = height;
    this.startY = startY;
    this.offsetX = offsetX;
    this.totalWidth = totalWidth;
    this.spacing = this.totalWidth / this.marks;
  }

  draw(context) {
    context.fillStyle = "blue"; // Cambia esto al color que prefieras para las marcas de la regla
    context.font = "12px Arial"; // Cambia esto al tamaño y tipo de letra que prefieras

    context.fillRect(this.offsetX, this.startY, this.totalWidth, 1);

    for (let i = 0; i <= this.marks; i++) {
      let x = i * this.spacing;

      context.fillRect(this.offsetX + x, this.startY, 1, this.height);

      context.fillText(
        Math.round((i * this.distance) / this.marks) + " m", // Usa Math.round() para redondear al número entero más cercano
        this.offsetX + x,
        this.startY + this.height * 2
      );
    }
  }
}
