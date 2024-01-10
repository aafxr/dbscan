// Author: Bhavik Maneck
export class DBSCAN {
  // $points is an array of unique ids for the points you clutsering
  // should correspond to keys of point distances in $distance_matrix
  //
  // Note $points can be a subset of the point ids in the distance matrix
  // if you want to perform dbscan clustering on a cluster produced by dbscan
  // see example on github readme for this
  $points;

  // is 2 dimensional array with point ids as keys and values as the distance between the points
  // can be an upper triangle of distances
  $distance_matrix;

  // maintains array of points not assigned to a cluster
  $noise_points;
  $in_a_cluster;
  $clusters;

  constructor($points) {
    this.$distance_matrix = {};
    this.$points = $points;
    this.$noise_points = [];
    this.$clusters = [];
    this.$in_a_cluster = [];

    for (const p1 of $points) {
      for (let i = 0; i < $points.length; i++) {
        const p2 = $points[i];

        if (p1 === p2) continue;
        if (!this.$distance_matrix[p1.id]) this.$distance_matrix[p1.id] = {};

        this.$distance_matrix[p1.id][p2.id] = this._distans(
          p1.x,
          p1.y,
          p2.x,
          p2.y
        );
      }
    }
  }

  // $new_points should be an array of unique point ids that is still a subset of
  // the keys in the distance matrix provided on construction
  //
  // this will allow clustering of previously produced clusters from DBSCAN
  set_points(new_points) {
    this.points = new_points;
  }

  _distans(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  _expand_cluster($point, $neighbor_points, c, $epsilon, $min_points) {
    this.clusters[c].push($point);
    this.in_a_cluster.push($point);
    let idx = 0;
    let $neighbor_point = $neighbor_points[idx];
    while ($neighbor_point) {
      let $neighbor_points2 = this._region_query($neighbor_point, $epsilon);
      if ($neighbor_points2.length >= $min_points) {
        for (const $neighbor_point2 of $neighbor_points2) {
          if (!$neighbor_points.includes($neighbor_point2)) {
            $neighbor_points.push($neighbor_point2);
          }
        }
      }
      if (!this.$in_a_cluster.includes($neighbor_point)) {
        this.clusters[c].push($neighbor_point);
        this.in_a_cluster.push($neighbor_point);
      }

      idx++;
      $neighbor_point = $neighbor_points[idx];
    }
  }

  _region_query($point, $epsilon) {
    let $neighbor_points = [];

    let $distance = Infinity;

    for (const $point2 of this.$points) {
      if ($point != $point2) {
        // Because we are using an upper diagonal representation of distances between points
        if ($point2.id in this.$distance_matrix[$point.id]) {
          $distance = this.$distance_matrix[$point.id][$point2.id];
        } else if ($point.id in this.$distance_matrix[$point2.id]) {
          $distance = this.$distance_matrix[$point2.id][$point.id];
        }

        if ($distance < $epsilon) {
          $neighbor_points.push($point2);
        }
      }
    }
    return $neighbor_points;
  }

  // epsilon is min distance to cluster around
  // min_points is minimum number of points within epsilon of another point needed to form a cluster
  //
  // Returns an array of arrays
  // each inner array is a cluster with point ids belonging to that cluster as members
  dbscan($epsilon, $min_points) {
    this.noise_points = []; // points that do no belong to any cluster
    this.clusters = []; // contains an array for each cluster, each cluster array has points ids belonging to that cluster
    this.in_a_cluster = []; // points that have been added to a cluster

    let c = 0;
    this.clusters[c] = [];
    for (const $point_id of this.$points) {
      let $neighbor_points = this._region_query($point_id, $epsilon);

      if ($neighbor_points.length < $min_points) {
        this.noise_points.push($point_id);
      } else if (!this.$in_a_cluster.includes($point_id)) {
        this._expand_cluster(
          $point_id,
          $neighbor_points,
          c,
          $epsilon,
          $min_points
        );
        c = c + 1;
        this.clusters[c] = [];
      }
    }

    return this.clusters;
  }
}
