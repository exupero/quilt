(ns dots.geo
  (:require-macros [dots.macros :refer [spy]])
  (:require [dots.util :as u]))

(defn quilt-walls [dots col-offsets row-offsets]
  (concat
    (for [[offset column] (map vector col-offsets (vals (sort-by key (group-by :column dots))))
          [a b] (->> column
                  (sort-by :row)
                  (drop offset)
                  (partition 2 2))]
      {:type :wall :points [a b]})
    (for [[offset row] (map vector row-offsets (vals (sort-by key (group-by :row dots))))
          [a b] (->> row
                  (sort-by :column)
                  (drop offset)
                  (partition 2 2))]
      {:type :wall :points [a b]})))

(defn grid [cols rows]
  (let [cells (for [col (range cols)
                    row (range rows)]
                {:id (gensym "cell")
                 :column col
                 :row row})]
    {:shape :grid
     :columns cols
     :rows rows
     :cells (u/by-id cells)}))

(defn grid-vertices [{:keys [columns rows]}]
  (for [col (range (inc columns))
        row (range (inc rows))]
    {:column col :row row}))

(defn grid-adjacents [{:keys [cells]}]
  (let [cells (vals cells)
        pos->cell (into {} (map (juxt u/pos identity)) cells)
        neighbors (fn [col row]
                    [[(dec col) row]
                     [(inc col) row]
                     [col (dec row)]
                     [col (inc row)]])
        adjacent (fn [{:keys [column row]}]
                   (->> (neighbors column row)
                     (map (comp :id pos->cell))
                     (remove nil?)
                     set))]
    (into {} (map (juxt :id adjacent)) cells)))

(defn wall->walls [[[x1 y1] [x2 y2]]]
  (cond
    (= x1 x2) (let [[y1 y2] (sort [y1 y2])]
                (for [y (range y1 y2)]
                  [[x1 y] [x1 (inc y)]]))
    (= y1 y2) (let [[x1 x2] (sort [x1 x2])]
                (for [x (range x1 x2)]
                  [[x y1] [(inc x) y1]]))
    :else [[[x1 y1] [x2 y2]]]))

(defn wall->adjacent [[x1 y1 :as p1] [x2 y2 :as p2]]
  (cond
    (= x1 x2) (if (< y1 y2)
                #{[(dec x1) y1] [x2 (dec y2)]}
                #{[x1 (dec y1)] [(dec x2) y2]})
    (= y1 y2) (if (< x1 x2)
                #{[x1 (dec y1)] [(dec x2) y2]}
                #{[(dec x1) y1] [x2 (dec y2)]})
    :else [p1 p2]))

(defn unadjacent [adjacents [a b]]
  (-> adjacents
    (update a disj b)
    (update b disj a)))

(defn grid-walled [{:keys [cells] :as grid} walls]
  (let [adjacents (grid-adjacents grid)
        adjacent->ids (into {} (for [[id children] adjacents
                                     child children]
                                 [#{(u/pos (cells id)) (u/pos (cells child))}
                                  [id child]]))
        detach (comp
                 (map :points)
                 (map #(map u/pos %))
                 (mapcat wall->walls)
                 (map #(apply wall->adjacent %))
                 (remove nil?)
                 (map set)
                 (map adjacent->ids))]
    (assoc grid
      :adjacents (transduce detach unadjacent adjacents walls)
      :walls walls)))

(defn at? [pos cell]
  (= (u/pos pos) (u/pos cell)))

(defn section [{:keys [cells adjacents]} pos]
  (let [start (->> cells vals (filter #(at? pos %)) first :id)]
    (loop [acc #{start}]
      (if-let [adjacent (->> acc
                          (mapcat adjacents)
                          (remove acc)
                          seq)]
        (recur (apply conj acc adjacent))
        acc))))
