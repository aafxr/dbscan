const NOISE = 'noise';

// Функция для расчета квадрата расстояния между двумя точками
function squareDistance(point1, point2) {
  return (
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

// Функция инициализации случайных центроидов
function initRandomCentroids(data, k) {
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const index = Math.floor(Math.random() * data.length);
    const point = [...data[index]];
    point.clusterIndex = i + 1;
    centroids.push(point);
    // data.splice(index, 1);
  }
  return centroids;
}

// Функция обновления центроидов и принадлежности объектов к кластерам
function updateCluster(centroids, point) {
  let closestCentroidIndex = -1;
  let minDistance = Number.MAX_VALUE;
  for (const centroid of centroids) {
    const distance = squareDistance(centroid, point);
    if (distance < minDistance) {
      minDistance = distance;
      closestCentroidIndex = centroids.indexOf(centroid);
    }
  }
  return centroids[closestCentroidIndex].clusterIndex || -1;
}

/**
 * Основная функция K-means
 *
 *
 * алгоритм k-средних, разбивает массив точек __data__ на кластеры,
 * точнее к каждому елеменьу массива добавляет свойство __clusterIndex__,
 * означающее к какому кластеру относится элемент.
 *
 *
 * @param {[x:number, y: number][]} data массив точек
 * @param {number} k число клачтеров
 * @param {number} maxIterations максимальное число итераций
 * @param {number} epsilon минимальное отклонение, при достижении которого алгоритм останавливается до maxIterations
 * @returns
 */
export function kMeans(data, k, maxIterations, epsilon) {
  if (data.length <= k || maxIterations <= 0) {
    return null;
  }

  let initCentroids = initRandomCentroids(data, k);
  let iterations = 0;
  let changes = data.length;
  while (iterations < maxIterations && !converged(data, changes, epsilon)) {
    iterations += 1;
    changes = 0;
    for (const datum of data) {
      const cidx = updateCluster(initCentroids, datum);
      if (cidx !== datum.clusterIndex) changes += 1;
      datum.clusterIndex = cidx;
    }

    const newCentroids = getNewCentroids(data);

    initCentroids = newCentroids;
  }
}

function converged(data, changes, epsilon) {
  return changes < epsilon * data.length;
}

function getNewCentroids(data) {
  const groupse = Object.groupBy(data, (datum) => datum.clusterIndex);

  const newCentroids = Object.values(groupse).map((groupe) => {
    let sum_x = 0;
    let sum_y = 0;
    const clusterIndex = groupe[0].clusterIndex;
    for (const datum of groupe) {
      sum_x += datum[0];
      sum_y += datum[1];
    }
    const result = [sum_x / groupe.length, sum_y / groupe.length];
    result.clusterIndex = clusterIndex;

    return result;
  });

  return newCentroids;
}
