(ns dots.ui
  (:require-macros [dots.macros :refer [spy]])
  (:require [vdom.core :as vdom]
            [dots.geo :as geo]
            [dots.util :as u]
            [dots.update :as up]))

(defn pair [[x y]]
  (str x "," y))

(defn path [coords]
  (->> coords
    (map pair)
    (interpose "L")
    (apply str "M")))

(defn closed-path [coords]
  (str (path coords) "Z"))

(defmulti shape (fn [s _ _] (:shape s)))

(defmethod shape :grid
  [{:keys [cells] :as grid}
   {:keys [size show using]}
   emit]
  (let [r 1.5
        x (u/linear [0 (grid :columns)] [r (- size r)])
        y (u/linear [0 (grid :rows)] [r (- size r)])
        mid #(+ 0.5 %)]
    [:g {}
     [:g {:class "cells"}
      (for [{:keys [id column row shade]} (vals cells)
            :let [left (x column)
                  right (x (inc column))
                  top (y row)
                  bottom (y (inc row))]]
        [:path {:id id
                :class (str "cell "
                            (if (show :cells) "cell--visible")
                            (if shade (str "cell--" (name shade))))
                :d (closed-path [[left top]
                                 [right top]
                                 [right bottom]
                                 [left bottom]])
                :onclick #(emit [:shade {:column column :row row}])}])]
     (if (show :dots)
       [:g {:class "dots"}
        (for [{:keys [column row]} (geo/grid-vertices grid)]
          [:circle {:class "dot" :r r :cx (x column) :cy (y row)}])])
     [:g {:class "walls"}
      (for [edge (grid :walls)
            :let [[a b] (edge :points)]]
        [:line {:class "wall"
                :x1 (x (a :column))
                :y1 (y (a :row))
                :x2 (x (b :column))
                :y2 (y (b :row))}])]
     (if (show :adjacents)
       [:g {:class "adjacent"}
        (for [pair (->> grid :adjacents u/tree->pairs (map set) distinct)
              :let [[a b] (seq pair)
                    {scol :column srow :row} (cells a)
                    {dcol :column drow :row} (cells b)]]
          [:line {:class "adjacent" :x1 (x (mid scol)) :y1 (y (mid srow)) :x2 (x (mid dcol)) :y2 (y (mid drow))}])])]))

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
   [:svg {:width size :height size}
    (shape s model emit)]])
