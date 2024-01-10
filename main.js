import chroma from "chroma-js";
import { Canvas } from "./classes/Canvas";
import { DBSCAN } from "./classes/DBSCAN";
// import { points } from "./points";
import "./style.css";
import generatePoints from "./utils/generatePoints";

const app = document.querySelector("#app");
/**@type{HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");

// const data = generatePoints(100, 750,480)
// app.innerHTML += `
// <pre>
// ${data}
// </pre>
// `




const points = generatePoints(350, 750, 480)

const cnv = new Canvas("#canvas", "#111", "#7a015e");

// for (const p of points) {
//   cnv.drawPoint(p.x, p.y, 4, "#ccc");
// }

const dbscan = new DBSCAN(points);
const clusters = dbscan.dbscan(45, 3);



// console.log(dbscan);
console.log(clusters);

const colors = chroma.scale(['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink']).colors(clusters.length);
// // console.log(colors);

cnv.clearCanvas()
for (let i = 0; i < clusters.length; i++){
  const cluster = clusters[i]
  for (const p of cluster) {
    cnv.drawPoint(p.x, p.y, 2, p.cluster === 'noise' ? '#333' : colors[i]);
  }
}

// function draw(cnv, clusters = [], colors = [], idx = 0, delay = 1000) {
//   const cluster = clusters[idx];
//   const color = colors[idx];

//   for (const p of cluster) {
//     cnv.drawPoint(p.x, p.y, 4, p.cluster === 'noise' ? '#333':color);
//   }

//   if (clusters[idx + 1]) {
//     setTimeout(() => draw(cnv, clusters, colors, idx + 1, delay) , delay);
//   }

//   // console.log(color);
// }

// draw(cnv, clusters, colors,  0, 0);
