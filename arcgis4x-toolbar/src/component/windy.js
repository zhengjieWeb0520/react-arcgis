// 粒子配置
let VELOCITY_SCALE = 0.011;
let INTENSITY_SCALE_STEP = 10;
let MAX_WIND_INTENSITY = 40;
let MAX_PARTICLE_AGE = 100;
let PARTICLE_LINE_WIDTH = 2;
let PARTICLE_MULTIPLIER = 1 / 30;
let PARTICLE_REDUCTION = 0.75;
let FRAME_RATE = 20;
let NULL_WIND_VECTOR = [NaN, NaN, null];

// Windy类和Tools类私有方法
let bilinearInterpolateVector = Symbol("bilinearInterpolateVector");
let buildGrid = Symbol("buildGrid");
let isValue = Symbol("isValue");
let floorMod = Symbol("floorMod");
let isMobile = Symbol("isMobile");
let distort = Symbol("distort");
let distortion = Symbol("distortion");
let createField = Symbol("createField");
let buildBounds = Symbol("buildBounds");
let deg2rad = Symbol("deg2rad");
let rad2deg = Symbol("rad2deg");
let invert = Symbol("invert");
let mercY = Symbol("mercY");
let project = Symbol("project");
let animate = Symbol("animate");
let interpolate = Symbol("interpolate");
let interpolateField = Symbol("interpolateField");

// Windy类的工具类
class Tools {
  /**
   * @returns {Boolean} 指定的值是不是null或者undefined
   */
  [isValue](x) {
    return x !== null && x !== undefined;
  }

  /**
   * @returns {Number}
   *
   */
  [floorMod](a, n) {
    return a - n * Math.floor(a / n);
  }

  /**
   * @returns {Boolean}
   */
  [isMobile]() {
    return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(
      navigator.userAgent
    );
  }

  //度转弧度
  [deg2rad](deg) {
    return (deg / 180) * Math.PI;
  }

  //弧度转度
  [rad2deg](ang) {
    return ang / (Math.PI / 180.0);
  }

  [invert](x, y, windy) {
    let mapLonDelta = windy.east - windy.west;
    let worldMapRadius =
      ((windy.width / this[rad2deg](mapLonDelta)) * 360) / (2 * Math.PI);
    let mapOffsetY =
      (worldMapRadius / 2) *
      Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south)));
    let equatorY = windy.height + mapOffsetY;
    let a = (equatorY - y) / worldMapRadius;

    let lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
    let lon =
      this[rad2deg](windy.west) +
      (x / windy.width) * this[rad2deg](mapLonDelta);
    return [lon, lat];
  }

  [mercY](lat) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  }

  [project](lat, lon, windy) {
    // 以弧度为单位，必要时使用deg2rad
    let ymin = this[mercY](windy.south);
    let ymax = this[mercY](windy.north);
    let xFactor = windy.width / (windy.east - windy.west);
    let yFactor = windy.height / (ymax - ymin);

    let y = this[mercY](this[deg2rad](lat));
    let x = (this[deg2rad](lon) - windy.west) * xFactor;
    y = (ymax - y) * yFactor;
    return [x, y];
  }
}

class Windy extends Tools {
  constructor(params) {
    super();
    this.params = params;
    this.VELOCITY_SCALE = VELOCITY_SCALE;
    this.INTENSITY_SCALE_STEP = INTENSITY_SCALE_STEP;
    this.MAX_WIND_INTENSITY = MAX_WIND_INTENSITY;
    this.MAX_PARTICLE_AGE = MAX_PARTICLE_AGE;
    this.PARTICLE_LINE_WIDTH = PARTICLE_LINE_WIDTH;
    this.PARTICLE_MULTIPLIER = PARTICLE_MULTIPLIER;
    this.PARTICLE_REDUCTION = PARTICLE_REDUCTION;
    this.FRAME_RATE = FRAME_RATE;
    this.NULL_WIND_VECTOR = NULL_WIND_VECTOR;
    this.grid = [];
    this.builder = {
      header: params.data.header,
      data: function(i) {
        return [params.data.data.uComp[i], params.data.data.vComp[i]];
      }
    };

    //兼容性设置window.requestAnimationFrame
    window.requestAnimationFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 20);
        }
      );
    })();
  }

  [distort](λ, φ, x, y, scale, wind, windy) {
    let u = wind[0] * scale;
    let v = wind[1] * scale;
    let d = this[distortion](λ, φ, x, y, windy);

    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  }

  [distortion](λ, φ, x, y, windy) {
    let τ = 2 * Math.PI;
    let H = Math.pow(10, -5.2);
    let hλ = λ < 0 ? H : -H;
    let hφ = φ < 0 ? H : -H;

    let pλ = this[project](φ, λ + hλ, windy);
    let pφ = this[project](φ + hφ, λ, windy);
    let k = Math.cos((φ / 360) * τ);
    return [
      (pλ[0] - x) / hλ / k,
      (pλ[1] - y) / hλ / k,
      (pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ
    ];
  }

  [createField](columns, bounds) {
    let _this = this;
    // /**
    //  * @returns {Array}
    //  */
    function field(x, y) {
      let column = columns[Math.round(x)];
      return (column && column[Math.round(y)]) || _this.NULL_WIND_VECTOR;
    }
    field.release = function() {
      columns = [];
    };

    field.randomize = function(o) {
      let x, y;
      let safetyNet = 0;
      do {
        x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
        y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y);
      } while (field(x, y)[2] === null && safetyNet++ < 30);
      o.x = x;
      o.y = y;
      return o;
    };

    (function(bounds, field) {
      // 使用随机点为画布设置动画
      this.windy.field = field;
      _this[animate](bounds, field);
    })(bounds, field);
  }

  [buildBounds](bounds, width, height) {
    let upperLeft = bounds[0];
    let lowerRight = bounds[1];
    let x = Math.round(upperLeft[0]);
    let y = Math.max(Math.floor(upperLeft[1], 0), 0);
    let yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
    return {
      x: x,
      y: y,
      xMax: width,
      yMax: yMax,
      width: width,
      height: height
    };
  }

  // 建立格网
  [buildGrid]() {
    let ni = this.builder.header.nx;
    let nj = this.builder.header.ny;
    let p = 0;
    let isContinuous = Math.floor(ni * this.builder.header.dx) >= 360;
    for (let j = 0; j < nj; j++) {
      let row = [];
      for (let i = 0; i < ni; i++, p++) {
        row[i] = this.builder.data(p);
      }
      if (isContinuous) {
        row.push(row[0]);
      }
      this.grid[j] = row;
    }
  }

  // (u,v,m)风等向量差值
  [bilinearInterpolateVector](x, y, g00, g10, g01, g11) {
    let rx = 1 - x;
    let ry = 1 - y;
    let a = rx * ry,
      b = x * ry,
      c = rx * y,
      d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  }

  [interpolate](λ, φ) {
    let i =
      this[floorMod](λ - this.builder.header.lo1, 360) / this.builder.header.dx;
    let j = (this.builder.header.la1 - φ) / this.builder.header.dy;

    let fi = Math.floor(i);
    let ci = fi + 1;
    let fj = Math.floor(j);
    let cj = fj + 1;

    let row;
    if ((row = this.grid[fj])) {
      let g00 = row[fi];
      let g10 = row[ci];
      if (this[isValue](g00) && this[isValue](g10) && (row = this.grid[cj])) {
        let g01 = row[fi];
        let g11 = row[ci];
        if (this[isValue](g01) && this[isValue](g11)) {
          return this[bilinearInterpolateVector](
            i - fi,
            j - fj,
            g00,
            g10,
            g01,
            g11
          );
        }
      }
    }
    return null;
  }

  [interpolateField](bounds, extent, callback) {
    let _this = this;
    let velocityScale = this.VELOCITY_SCALE;

    let columns = [];
    let x = bounds.x;

    function interpolateColumn(x) {
      let column = [];
      for (let y = bounds.y; y <= bounds.yMax; y += 2) {
        let coord = _this[invert](x, y, extent);
        if (coord) {
          let λ = coord[0],
            φ = coord[1];
          if (isFinite(λ)) {
            let wind = _this[interpolate](λ, φ);
            if (wind) {
              wind = _this[distort](λ, φ, x, y, velocityScale, wind, extent);
              column[y + 1] = column[y] = wind;
            }
          }
        }
      }
      columns[x + 1] = columns[x] = column;
    }
    (function batchInterpolate() {
      let start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if (Date.now() - start > 1000) {
          setTimeout(batchInterpolate, 25);
          return;
        }
      }
      _this[createField](columns, bounds, callback);
    })();
  }

  [animate](bounds, field) {
    let _this = this;

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }
    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }

    function windIntensityColorScale(step, maxWind) {
      // 根据风级（m）选择颜色
      let result = [
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0.5 +
          ")",
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0.4 +
          ")",
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0.3 +
          ")",
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0.2 +
          ")",
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0.1 +
          ")",
        "rgba(" +
          hexToR("#ffffff") +
          ", " +
          hexToG("#ffffff") +
          ", " +
          hexToB("#ffffff") +
          ", " +
          0 +
          ")"
      ];
      result.indexFor = function(m) {
        return Math.floor(
          (Math.min(m, maxWind) / maxWind) * (result.length - 1)
        );
      };
      return result;
    }

    let colorStyles = windIntensityColorScale(
      this.INTENSITY_SCALE_STEP,
      this.MAX_WIND_INTENSITY
    );
    let buckets = colorStyles.map(function() {
      return [];
    });

    let particleCount = Math.round(
      bounds.width * bounds.height * this.PARTICLE_MULTIPLIER
    );
    if (this[isMobile]()) {
      particleCount *= this.PARTICLE_REDUCTION;
    }

    let fadeFillStyle = "rgba(0, 0, 0, 0)";

    let particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        field.randomize({
          age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0
        })
      );
    }

    function evolve() {
      buckets.forEach(function(bucket) {
        bucket.length = 0;
      });
      particles.forEach(function(particle) {
        if (particle.age > _this.MAX_PARTICLE_AGE) {
          field.randomize(particle).age = 0;
        }
        let x = particle.x;
        let y = particle.y;
        let v = field(x, y);
        let m = v[2];
        if (m === null) {
          particle.age = _this.MAX_PARTICLE_AGE;
        } else {
          let xt = x + v[0];
          let yt = y + v[1];
          if (field(xt, yt)[2] !== null) {
            particle.xt = xt;
            particle.yt = yt;
            buckets[colorStyles.indexFor(m)].push(particle);
          } else {
            particle.x = xt;
            particle.y = yt;
          }
        }
        particle.age += 1;
      });
    }
    let g = this.params.canvas.getContext("2d");
    g.lineWidth = this.PARTICLE_LINE_WIDTH;
    g.fillStyle = fadeFillStyle;

    function draw() {
      let prev = g.globalCompositeOperation;
      g.globalCompositeOperation = "destination-in";
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.globalCompositeOperation = prev;

      buckets.forEach(function(bucket, i) {
        if (bucket.length > 0) {
          g.beginPath();
          g.strokeStyle = colorStyles[i];
          bucket.forEach(function(particle) {
            g.moveTo(particle.x, particle.y);
            g.lineTo(particle.xt, particle.yt);
            particle.x = particle.xt;
            particle.y = particle.yt;
          });
          g.stroke();
        }
      });
    }

    (function frame() {
      try {
        this.windy.timer = setTimeout(function() {
          requestAnimationFrame(frame);
          evolve();
          draw();
        }, 1000 / _this.FRAME_RATE);
      } catch (e) {
        console.error(e);
      }
    })();
  }

  start(bounds, width, height, extent) {
    let _this = this;
    let mapBounds = {
      south: this[deg2rad](extent[0][1]),
      north: this[deg2rad](extent[1][1]),
      east: this[deg2rad](extent[1][0]),
      west: this[deg2rad](extent[0][0]),
      width: width,
      height: height
    };

    this.stop();

    // 建立网格
    this[buildGrid]();

    // 插值场
    _this[interpolateField](
      _this[buildBounds](bounds, width, height),
      mapBounds
    );
  }

  stop() {
    if (this.windy.field) this.windy.field.release();
    if (this.windy.timer) clearTimeout(this.windy.timer);
  }
}

export default Windy;
