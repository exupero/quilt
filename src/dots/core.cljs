(ns dots.core
  (:require-macros [dots.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [dots.geo :as geo]))

(enable-console-print!)

(defn ui [{:keys [width height shapes]} emit]
  [:svg {:width width :height height}
   [:g {:transform "translate(1.5, 1.5)"}
    (for [s shapes]
      (condp = (:type s)
        :dot [:circle {:class "dot" :r 0.5 :cx (s :x) :cy (s :y)}]
        :line [:line {:class "line" :x1 (s :x1) :y1 (s :y1) :x2 (s :x2) :y2 (s :y2)}]))]])

(defn step [model action]
  (match action
    :no-op model
    [:shapes shapes] (assoc model :shapes shapes)
    [:dimensions]))

(def initial-model
  (let [w 500
        h 500]
    {:width w
     :height h
     :shapes (geo/corridors w h 128 128 0.6)}))

(defonce actions (chan))
(def emit #(put! actions %))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui % emit) [models]) (.getElementById js/document "app")))

(defn figwheel-reload []
  (put! actions :no-op))
