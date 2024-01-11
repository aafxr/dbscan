import { Canvas } from './classes/Canvas';
import { DBSCAN } from './classes/DBSCAN';
import { kMeans } from './k-means/k-meas';
import { points } from './points';
import './style.css';

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink'];

const app = document.querySelector('#app');

/**
 *
 *
 *
 *
 *
 */

/**@type{HTMLInputElement} */
const dbscan_range = document.querySelector('#dbscan-range');

const dbscan_cnv = new Canvas('#dbscan-canvas', '#111', '#7a015e');
const dbscan = new DBSCAN(points);

function drawDBSCAN(eps, dencity) {
  points.forEach((p) => delete p.cluster);

  const clusters = dbscan.dbscan(eps, dencity);
  dbscan_cnv.clearCanvas();
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    for (const p of cluster) {
      dbscan_cnv.drawPoint(
        p.x,
        p.y,
        2,
        p.cluster === 'noise' ? '#333' : colors[i % colors.length]
      );
    }
  }
}

const db_c = +dbscan_range.value;
const range = 200;
drawDBSCAN(range, db_c);

dbscan_range.addEventListener('change', (e) => {
  const db_c = +e.target.value;
  drawDBSCAN(range, db_c);
});

/**
 *
 *
 *
 *
 *
 */

/**@type{HTMLInputElement} */
const k_range = document.querySelector('#k-range');

const k_cnv = new Canvas('#k-canvas', '#111', '#7a015e');

function drawKMeans(points, clustersCount, maxIterations, eps) {
  const _points = [...points];
  kMeans(_points, clustersCount, maxIterations, eps);

  k_cnv.clearCanvas();
  for (const p of _points) {
    k_cnv.drawPoint(
      p[0],
      p[1],
      2,
      ~p.clusterIndex ? colors[p.clusterIndex % colors.length] : '#333'
    );
  }

  // console.log(Object.groupBy(_points, (p) => p.clusterIndex));
}

const kMeans_points = points.map(({ x, y }) => [x, y]);
const k_c = +k_range.value;

drawKMeans(kMeans_points, k_c, kMeans_points.length * 2, 0.0001);

k_range.addEventListener('change', (e) => {
  const k_c = +e.target.value;

  drawKMeans(kMeans_points, k_c, kMeans_points.length * 2, 0.01);
});
