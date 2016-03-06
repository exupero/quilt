(require 'cljs.build.api)

(cljs.build.api/build "src"
  {:main 'quilt.core
   :source-paths ["src"]
   :asset-path "js"
   :optimizations :advanced
   :output-to "resources/public/js/quilt.js"
   :output-dir "resources/public/js"})
