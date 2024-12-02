document.addEventListener("DOMContentLoaded", () => {
  const canvasMain = document.getElementById("canvas");
  const canvases = document.querySelectorAll("canvas");
  let activeCanvas = null;
  canvases.forEach((canvas) => {
    if (canvas !== canvasMain) {
      canvas.classList.add("canvas");
      canvas.addEventListener("click", () => {
        const container = canvas.closest(".container");
        if (!activeCanvas) {
          if (container) {
            canvas.style.width = `${container.clientWidth}px`;
            canvas.style.height = `${container.clientHeight}px`;
          }
          canvas.classList.add("fullscreen");
          activeCanvas = canvas;
        } else if (activeCanvas === canvas) {
          canvas.classList.remove("fullscreen");
          canvas.style.width = "";
          canvas.style.height = "";
          activeCanvas = null;
        }
      });
    }
  });
});
