(require '[figwheel-sidecar.repl :as r]
         '[figwheel-sidecar.repl-api :as ra])

(ra/start-figwheel!
  {:figwheel-options {:css-dirs ["resources/public/css"]}
   :build-ids ["dev"]
   :all-builds
   [{:id "dev"
     :figwheel {:on-jsload "quilt.core/figwheel-reload"}
     :source-paths ["src"]
     :optimizations :none
     :compiler {:main 'quilt.core
                :asset-path "js-dev"
                :output-to "resources/public/js-dev/quilt.js"
                :output-dir "resources/public/js-dev"
                :verbose true}}]})

(ra/cljs-repl)
