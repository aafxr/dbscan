const NOISE = 'noise';

export class DBSCAN {
  points;
  clusters;
  distance = {};

  constructor(points) {
    this.points = points;

    // расчет растояний для всех точек
    // for (let i = 0; i < this.points.length; i++) {
    //   for (let j = i; j < this.points.length; j++) {
    //     const p1 = points[i];
    //     const p2 = points[j];

    //     if (this.distance[p1.id + ':' + p2.id]) continue;

    //     if (i === j) {
    //       this.distance[p1.id + ':' + p2.id] = Infinity;
    //       continue;
    //     }

    //     const dist = this._distans(p1.x, p1.y, p2.x, p2.y);
    //     this.distance[p1.id + ':' + p2.id] = dist;
    //     this.distance[p2.id + ':' + p1.id] = dist;
    //   }
    // }
  }

  _distans(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  _squareDistans(x1, y1, x2, y2) {
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
  }

  /**
   * метод объеденяет точки в группы основываясь на парамеирах плотности
   * @param {number} eps отклонение (растояние между точками)
   * @param {number} min_points число точек, которые должны быть в диапазоне eps
   * @returns
   */
  dbscan(eps, min_points) {
    let c = 0; //метка кластера
    for (const point of this.points) {
      if (point.cluster === NOISE) continue;

      // список всех соседей к данной точки
      const neighbors = this.rangeQuery(point, eps);
      if (neighbors.length < min_points) {
        point.cluster = NOISE;
        continue;
      }

      // если точка удовлетворяет условиям min_points, помечаем ее меткой кластера
      // и далее проверяем ее соседей по той жже схеме
      c += 1;
      point.cluster = c;

      const seed = neighbors;
      let index = 0;
      let seed_point = seed[index];
      // проверка соседей точки
      while (seed_point) {
        if (seed_point.cluster !== undefined && seed_point.cluster !== NOISE) {
          seed_point.cluster = c;
          index++;
          seed_point = seed[index];
          continue;
        }

        seed_point.cluster = c;
        let neighbors_2 = this.rangeQuery(seed_point, eps);
        //если соседняя точка удовлетворяет условиям плотности
        //добавляем ее новых соседей в конец маассива seed
        if (neighbors_2.length >= min_points) {
          neighbors_2 = neighbors_2.filter((nb) => !seed.includes(nb));
          seed.push(...neighbors_2);
        }

        index++;
        seed_point = seed[index];
      }
    }

    const groups = Object.groupBy(this.points, (p) => p.cluster);

    if (!groups[NOISE]) groups[NOISE] = [];

    Object.keys(groups).forEach((key) => {
      if (key !== NOISE && groups[key] && groups[key].length < min_points) {
        groups[NOISE].push(...groups[key]);
        groups[key].forEach((p) => (p.cluster = NOISE));
        delete groups[key];
      }
    });
    const result = Object.values(groups);
    return result;
  }

  /**
   * поиск всех соседей точки, которые удовлетворяют условиям плотности
   * @returns {Array}
   */
  rangeQuery(point, eps) {
    const neighbors = [];
    const _eps = eps * eps;
    for (const p2 of this.points) {
      const dist = this._squareDistans(point.x, point.y, p2.x, p2.y);
      if (dist && dist < _eps) neighbors.push(p2);
    }
    return neighbors;
  }
}
