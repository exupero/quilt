(ns dots.macros)

(defmacro spy [x]
  `(let [x# ~x]
     (println '~x " => " x#)
     x#))
