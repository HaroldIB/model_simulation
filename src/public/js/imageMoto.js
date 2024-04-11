class ImageMoto {
    constructor(src, width, height) {
      this.img = new Image();
      this.img.src = src;
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.width = width;
      this.height = height;
    }
  
    draw(context) {
      context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }