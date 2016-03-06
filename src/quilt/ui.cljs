(ns quilt.ui
  (:require-macros [quilt.macros :refer [spy]])
  (:require [vdom.core :as vdom]
            [vdom.hooks :refer [hook]]
            [quilt.geo :as geo]
            [quilt.util :as u]
            [quilt.update :as up]))

(def shade->color
  {:ocean "dodgerblue"
   :sand "gold"
   :outcrop "chocolate"
   :grass "yellowgreen"
   :trees "forestgreen"
   :rock "rgb(80, 50, 50)"
   :water "deepskyblue"})

(defn draw
  [{:keys [cells walls columns rows] :as grid}
   {{:keys [x y]} :axes :keys [size show using dot-size]}
   emit]
  (fn [node _ _]
    (let [ctx (.getContext node "2d")
          w (/ (- size dot-size dot-size) columns)
          h (/ (- size dot-size dot-size) rows)]
      (.clearRect ctx 0 0 size size)
      (set! (.-strokeStyle ctx) "black")
      (doseq [{[a b] :points} walls]
        (doto ctx
          (.beginPath)
          (.moveTo (x (a :column)) (y (a :row)))
          (.lineTo (x (b :column)) (y (b :row)))
          (.stroke)))
      (doseq [{:keys [id column row shade]} (filter :shade (vals cells))]
        (set! (.-fillStyle ctx) (spy (shade->color shade)))
        (.fillRect ctx (x column) (y row) w h)))))

(defn event-loc [el event]
  [(- (.-pageX event) (.-offsetLeft el))
   (- (.-pageY event) (.-offsetTop el))])

(defn ui [{s :shape :keys [size shades using] :as model} emit]
  [:div {}
   [:div {:className "controls"}
    (for [shade shades]
      [:div {:className (str "shader shader--" (name shade)
                             (if (= using shade) " shader--is-selected"))
             :onclick #(emit [:use shade])}])
    [:label {:className "size"}
     "Size: "
     [:input {:type "range"
              :min 200
              :max 1000
              :value size
              :onchange #(this-as this (emit [:size (.-value this)]))}]
     size]]
   [:canvas {:id "canvas" :width size :height size
             :onclick #(this-as this (emit [:shade-at (event-loc this %)]))
             :hookDraw (hook (draw s model emit))}]])
