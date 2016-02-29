(ns dots.geo
  (:require-macros [dots.macros :refer [spy]]))

(def extent (juxt #(apply min %) #(apply max %)))

(def coord (juxt :x :y))

(def sqr #(* % %))

(def sqrt #(.sqrt js/Math %))

(defn dist [[x1 y1] [x2 y2]]
  (sqrt (+ (sqr (- x1 x2)) (sqr (- y1 y2)))))

(defn dot-grid [w h count-x count-y]
  (for [x (range 0 (inc w) (/ w (dec count-x)))
        y (range 0 (inc h) (/ h (dec count-y)))]
    {:type :dot :x x :y y}))

(defn dot-random [w h density]
  (let [max-count (* density (/ (* w h) 2))]
    (loop [dots []
           c 0]
      (if (< c max-count)
        (recur (conj dots {:type :dot :x (* w (rand)) :y (* h (rand))}) (inc c))
        dots))))

(defn line-checkers [dots col-offsets row-offsets]
  (concat
    (for [[offset column] (map vector col-offsets (vals (sort-by key (group-by :x dots))))
          [a b] (->> column
                  (sort-by :y)
                  (drop offset)
                  (partition 2 2))]
      {:type :line
       :x1 (a :x) :y1 (a :y)
       :x2 (b :x) :y2 (b :y)})
    (for [[offset row] (map vector row-offsets (vals (sort-by key (group-by :y dots))))
          [a b] (->> row
                  (sort-by :x)
                  (drop offset)
                  (partition 2 2))]
      {:type :line
       :x1 (a :x) :y1 (a :y)
       :x2 (b :x) :y2 (b :y)})))

(defn drop-dots [f dots]
  (filter f dots))

(defn drop-inner-dots [f dots]
  (let [[left right] (extent (map :x dots))
        [top bottom] (extent (map :y dots))]
    (drop-dots
      (fn [{:keys [x y] :as dot}]
        (or (contains? #{left right} x)
            (contains? #{top bottom} y)
            (f dot)))
      dots)))

(defn corridors [w h count-x count-y freq]
  (let [dots (->> (dot-grid (- w 3) (- h 3) count-x count-y)
               (drop-inner-dots #(<= (rand) freq)))]
    (concat
      dots
      (line-checkers dots (cycle [0 1]) (cycle [0 1])))))
