(ns dots.update
  (:require-macros [dots.macros :refer [spy]])
  (:require [dots.geo :as geo]))

(defn flood [grid pos shade]
  (let [section (geo/section grid pos)
        shade (if (= :empty shade) nil shade)
        shader #(assoc-in %1 [%2 :shade] shade)]
    (update grid :cells #(reduce shader % section))))
