(ns dots.util)

(def extent (juxt #(apply min %) #(apply max %)))

(def coord (juxt :x :y))

(def sqr #(* % %))

(def sqrt #(.sqrt js/Math %))

(defn dist [[x1 y1] [x2 y2]]
  (sqrt (+ (sqr (- x1 x2)) (sqr (- y1 y2)))))

(defn linear [[x1 x2] [y1 y2]]
  (let [m (/ (- y2 y1) (- x2 x1))
        b (- y1 (* m x1))]
    #(+ (* m %) b)))

(defn map-vals [f m]
  (zipmap
    (keys m)
    (map f (vals m))))

(defn tree->pairs [tree]
  (for [[node children] tree
        child children]
    [node child]))

(def pos (juxt :column :row))

(defn by-id [items]
  (into {} (map (juxt :id identity)) items))

(defn xy->pos [[x y] {:keys [column row]}]
  {:column (.floor js/Math (column x))
   :row (.floor js/Math (row y))})
