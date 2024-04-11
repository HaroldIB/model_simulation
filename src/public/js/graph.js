class Graph {
  constructor(canvas, context, maxTime, maxDistance, titleY) {
    this.canvas = canvas;
    this.context = context;
    this.maxTime = maxTime;
    this.maxDistance = maxDistance;
    this.points = [];
    this.titleY = titleY;
  }

  addPoint(time, distance) {
    this.points.push({ time, distance });
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibuja los ejes
    // Dibuja los ejes
    this.context.strokeStyle = "black";
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(50, 50); // Cambia 50 a this.canvas.height - 50
    this.context.lineTo(50, this.canvas.height - 50); // Cambia 50 a this.canvas.height - 50
    this.context.lineTo(this.canvas.width - 50, this.canvas.height - 50); // Final del eje x
    this.context.stroke();

    // Dibuja las divisiones en los ejes
    this.context.strokeStyle = "gray";
    this.context.lineWidth = 1;
    const divisions = 10; // Número de divisiones en la grilla
    for (let i = 1; i <= divisions; i++) {
      const x = 50 + (i / divisions) * (this.canvas.width - 100);
      this.context.beginPath();
      this.context.moveTo(x, 50);
      this.context.lineTo(x, this.canvas.height - 50);
      this.context.stroke();
      this.context.fillText(
        (i * (this.maxTime / divisions)).toFixed(0),
        x,
        this.canvas.height - 30
      ); // Muestra el valor en cada división
    }
    for (let i = 1; i <= divisions; i++) {
      const y =
        this.canvas.height - 50 - (i / divisions) * (this.canvas.height - 100);
      this.context.beginPath();
      this.context.moveTo(50, y);
      this.context.lineTo(this.canvas.width - 50, y);
      this.context.stroke();
      this.context.fillText(
        (i * (this.maxDistance / divisions)).toFixed(0),
        30,
        y
      ); // Muestra el valor en cada división
    }

    // Dibuja los títulos de los ejes
    this.context.fillStyle = "black";
    this.context.font = "14px Arial";
    this.context.fillText(
      "Tiempo (s)",
      this.canvas.width / 2,
      this.canvas.height - 10
    );
    this.context.save();
    this.context.rotate(-Math.PI / 2);
    this.context.fillText(this.titleY, -this.canvas.height / 2, 20);
    this.context.restore();
    // Dibuja las flechas en los ejes
    this.context.strokeStyle = "black";
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(50, 50);
    this.context.lineTo(45, 55);
    this.context.moveTo(50, 50);
    this.context.lineTo(55, 55);
    this.context.moveTo(this.canvas.width - 50, this.canvas.height - 50);
    this.context.lineTo(this.canvas.width - 55, this.canvas.height - 55);
    this.context.moveTo(this.canvas.width - 50, this.canvas.height - 50);
    this.context.lineTo(this.canvas.width - 55, this.canvas.height - 45);
    this.context.stroke();

    // Dibuja los puntos
    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.points.forEach((point, index) => {
      const x = 50 + (point.time / this.maxTime) * (this.canvas.width - 100);
      const y =
        this.canvas.height -
        50 -
        (point.distance / this.maxDistance) * (this.canvas.height - 100);
      if (index === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    });
    this.context.stroke();
  }
}
