(ns quilt.core
  (:require-macros [quilt.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [quilt.geo :as geo]
            [quilt.ui :as ui]
            [quilt.util :as u]
            [quilt.update :as up]))

(enable-console-print!)

(defn axes [{:keys [columns rows size dot-size]}]
  {:x (u/linear [0 columns] [dot-size (- size dot-size)])
   :y (u/linear [0 rows] [dot-size (- size dot-size)])
   :column (u/linear [dot-size (- size dot-size)] [0 columns])
   :row (u/linear [dot-size (- size dot-size)] [0 rows])})

(defn step [model action]
  (match action
    :no-op model
    [:use shade] (assoc model :using shade)
    [:size size] (let [model (assoc model :size (int size))]
                   (assoc model :axes (axes model)))
    [:shade-at [x y]] (let [pos (u/xy->pos [x y] (model :axes))]
                        (update model :shape up/flood pos (model :using)))))

(defonce initial-model
  (let [columns 128
        rows 128
        size 1000
        r 1.5
        grid (geo/grid columns rows)
        dot-dropper (fn [{:keys [column row]}]
                      (and (< 0 column columns)
                           (< 0 row rows)
                           (< 0.5 (rand))))]
    {:columns columns
     :rows rows
     :size size
     :show #{}
     :shades [:empty :ocean :sand :outcrop :grass :trees :rock :water]
     :using :ocean
     :dot-size r
     :axes (axes {:columns columns :rows rows :size size :dot-size r})
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
