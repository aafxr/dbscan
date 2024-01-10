export class Canvas {
  /**@type{HTMLCanvasElement} */
  $canvas;
  clearColor = "#fff";
  currentColor = "#000";

  constructor(tag, clearColor, currentColor) {
    this.$canvas = document.querySelector(tag);

    if (clearColor) this.clearColor = clearColor;
    if (currentColor) this.currentColor = currentColor;

    this.clearCanvas()
  }

  /** @returns {CanvasRenderingContext2D} */
  _getContext() {
    return this.$canvas.getContext("2d");
  }

  drawPoint(x, y, r = 3, color) {
    if (color) this.currentColor = color;

    const ctx = this._getContext();

    ctx.beginPath();
    ctx.fillStyle = this.currentColor;
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }

  drawRect(x1, y1, x2, y2, color) {
    if (color) this.currentColor = color;

    const ctx = this._getContext();

    const width = x2 - x1;
    const height = y2 - y1;

    ctx.fillStyle = this.currentColor;
    ctx.fillRect(x1, y1, width, height);
  }

  clearCanvas(color) {
    if (color) this.clearCanvas = color;
    const ctx = this._getContext();

    const rect = this.$canvas.getBoundingClientRect();

    ctx.fillStyle = this.clearColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }
}
