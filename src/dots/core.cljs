(ns dots.core
  (:require-macros [dots.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [dots.geo :as geo]
            [dots.ui :as ui]
            [dots.util :as u]
            [dots.update :as up]))

(enable-console-print!)

(defn step [model action]
  (match action
    :no-op model
    [:use shade] (assoc model :using shade)
    [:size size] (assoc model :size (int size))
    [:shade-at [x y]] (let [pos (u/xy->pos [x y] (model :axes))]
                        (spy (model :using))
                        (update model :shape up/flood pos (model :using)))))

(defonce initial-model
  (let [size 1000
        columns 128
        rows 128
        r 1.5
        grid (geo/grid columns rows)
        dot-dropper (fn [{:keys [column row]}]
                      (and (< 0 column columns)
                           (< 0 row rows)
                           (< 0.5 (rand))))]
    {:size size
     :show #{}
     :shades [:empty :ocean :sand :outcrop :grass :trees :rock :water]
     :using :ocean
     :dot-size r
     :axes {:x (u/linear [0 columns] [r (- size r)])
            :y (u/linear [0 rows] [r (- size r)])
            :column (u/linear [r (- size r)] [0 columns])
            :row (u/linear [r (- size r)] [0 rows])}
     :shape (geo/grid-walled grid
              (geo/quilt-walls
                (remove dot-dropper (geo/grid-vertices grid))
                (cycle [0 1])
                (cycle [0 1])))}))

(defonce actions (chan))
(def emit #(put! actions %))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui/ui % emit) [models]) (.getElementById js/document "app")))

(defn figwheel-reload []
  (put! actions :no-op))
