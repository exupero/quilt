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
    [:shade pos] (update model :shape up/flood pos (model :using))))

(def initial-model
  (let [size 1000
        columns 50
        rows 50
        grid (geo/grid columns rows)
        dot-dropper (fn [{:keys [column row]}]
                      (and (< 0 column columns)
                           (< 0 row rows)
                           (< 0.5 (rand))))]
    {:size size
     :show #{}
     :shades [:empty :ocean :sand :outcrop :grass :trees :rock :water]
     :using :ocean
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
