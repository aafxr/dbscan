const NOISE = "noise";

export class DBSCAN {
  points;
  clusters;
  distance = {};

  constructor(points) {
    this.points = points;

    for (let i = 0; i < this.points.length; i++) {
      for (let j = i; j < this.points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];

        if (this.distance[p1.id + ":" + p2.id]) continue;

        if (i === j) {
          this.distance[p1.id + ":" + p2.id] = Infinity;
          continue;
        }

        const dist = this._distans(p1.x, p1.y, p2.x, p2.y);
        this.distance[p1.id + ":" + p2.id] = dist;
        this.distance[p2.id + ":" + p1.id] = dist;
      }
    }

    console.log(this.distance);
  }

  _distans(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  dbscan(eps, min_points) {
    let c = 0;
    for (const point of this.points) {
      if (point.cluster === NOISE) continue;

      const neighbors = this.rangeQuery(point, eps);
      if (neighbors.length < min_points) {
        point.cluster = NOISE;
        continue;
      }

      c += 1;
      point.cluster = c;

      const seed = neighbors;
      let index = 0;
      let seed_point = seed[index];
      while (seed_point) {
        // if(seed_point.cluster === NOISE) {
        //   seed_point.cluster = c
        //   index++;
        //   seed_point = seed[index];
        //   continue
        // }
        if (seed_point.cluster !== undefined && seed_point.cluster !== NOISE) {
          // this.points
          //   .forEach(p => p.cluster === seed_point.cluster &&  (p.cluster = c))
          seed_point.cluster = c
          index++;
          seed_point = seed[index]; 
          continue
        }

        seed_point.cluster = c
        let neighbors_2 = this.rangeQuery(seed_point, eps)
        if(neighbors_2.length >= min_points){
          neighbors_2 = neighbors_2.filter(nb => !seed.includes(nb))
          seed.push(...neighbors_2)

        }
        

        index++;
        seed_point = seed[index];
      }
    }

    const groups = Object.groupBy(this.points, (p) => p.cluster);

    if(!groups[NOISE]) groups[NOISE] = []
    
    Object.keys(groups)
      .forEach(key => {
        if(key !== NOISE && groups[key] && groups[key].length < min_points){
          groups[NOISE].push(...groups[key])
          groups[key].forEach(p => p.cluster = NOISE)
          delete groups[key]
        }
      })
    const result = Object.values(groups)
    return result;
  }


  /**
   * @returns {Array}
   */
  rangeQuery(point, eps) {
    const neighbors = [];
    for (const p2 of this.points) {
      // if (p2.cluster && p2.cluster !== NOISE) continue;

      const dist = this.distance[point.id + ":" + p2.id];
      if (dist && dist < eps) neighbors.push(p2);
    }
    return neighbors;
  }
}


// if (seed_point.cluster === NOISE) {
//   seed_point.cluster = c;
//   this.rangeQuery(seed_point, eps).forEach((p) => (p.cluster = c));

// } else if (seed_point.cluster !== undefined) {
//   this.points.forEach((p) => {
//     if (p.cluster === seed_point.cluster) {
//       p.cluster = seed_point.cluster;
//       this.rangeQuery(p, eps).forEach((p) => (p.cluster = c));
//     }
//   });

// } else {
//   seed_point.cluster = c;
//   let neighbors_2 = this.rangeQuery(seed_point, eps);

//   if (neighbors_2.length > min_points) {
//     neighbors_2 = neighbors_2.filter((nb) => !seed.includes(nb));
//     neighbors.forEach((p) => (p.cluster = c))
//     seed.push(...neighbors_2);
//   } else if (seed_point.cluster === undefined) {
//     seed_point.cluster = NOISE;
//   }
// }