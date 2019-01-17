@echo off
call npm install https://github.com/songyumeng/jsdoc-i18n.git#foriClient -g
call jsdoc-i18n-render  -c ./build/jsdocs/leaflet/docs.json -l en -R ./web/build/doci18n/leaflet/index.md -d ./web/en/docs/leaflet
call jsdoc-i18n-render  -c ./build/jsdocs/openlayers/docs.json -l en -R ./web/build/doci18n/openlayers/index.md -d ./web/en/docs/openlayers
call jsdoc-i18n-render  -c ./build/jsdocs/mapboxgl/docs.json -l en -R ./web/build/doci18n/mapboxgl/index.md -d ./web/en/docs/mapboxgl
call jsdoc-i18n-render  -c ./build/jsdocs/classic/docs.json -l en -R ./web/build/doci18n/classic/index.md -d ./web/en/docs/classic
call jsdoc-i18n-render  -c ./build/jsdocs/classic/docs.json -l en -R ./web/build/doci18n/classic/index.md -d ./web/en/docs/classic