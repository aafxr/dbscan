/**
 * @param {number} num 
 * @param {number} max_X 
 * @param {number} max_Y 
 * @returns {{id:string, x:number, y:number}}
 */
export default function generatePoints(num = 30, max_X = 249, max_Y = 199) {
    const data = []
  for (let i = 0; i < num; i++) {
    const id = "" + Math.round(Math.random() * max_X * max_Y * 2+ 1);
    const x = Math.round(Math.random() * max_X + 1);
    const y = Math.round(Math.random() * max_Y + 1);

    data.push({
      id,
      x,
      y,
      toString() {
        return `\n{id:${this.id}, x:${this.x}, y:${this.y}}`;
      },
    });
  }

  return data
}
