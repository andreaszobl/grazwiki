
var template =
    '{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg';
var urls = [
  'http://maps1.wien.gv.at/basemap/' + template,
  'http://maps2.wien.gv.at/basemap/' + template,
  'http://maps3.wien.gv.at/basemap/' + template,
  'http://maps4.wien.gv.at/basemap/' + template,
  'http://maps.wien.gv.at/basemap/' + template
];


// HiDPI support:
// * Use 'bmaphidpi' layer (pixel ratio 2) for device pixel ratio > 1
// * Use 'geolandbasemap' layer (pixel ratio 1) for device pixel ratio == 1
var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;

var source = new ol.source.WMTS({
  projection: 'EPSG:3857',
  layer: hiDPI ? 'bmaphidpi' : 'geolandbasemap',
  tilePixelRatio: hiDPI ? 2 : 1,
  style: 'normal',
  matrixSet: 'google3857',
  urls: urls,
  requestEncoding: 'REST',
  tileGrid: new ol.tilegrid.WMTS({
    origin: [-20037508.3428, 20037508.3428],
    resolutions: [
      559082264.029 * 0.28E-3,
      279541132.015 * 0.28E-3,
      139770566.007 * 0.28E-3,
      69885283.0036 * 0.28E-3,
      34942641.5018 * 0.28E-3,
      17471320.7509 * 0.28E-3,
      8735660.37545 * 0.28E-3,
      4367830.18773 * 0.28E-3,
      2183915.09386 * 0.28E-3,
      1091957.54693 * 0.28E-3,
      545978.773466 * 0.28E-3,
      272989.386733 * 0.28E-3,
      136494.693366 * 0.28E-3,
      68247.3466832 * 0.28E-3,
      34123.6733416 * 0.28E-3,
      17061.8366708 * 0.28E-3,
      8530.91833540 * 0.28E-3,
      4265.45916770 * 0.28E-3,
      2132.72958385 * 0.28E-3,
      1066.36479193 * 0.28E-3
    ],
    matrixIds: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ]
  })
});

var layers = [
              
              new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://demo.boundlessgeo.com/geoserver/wms',
                  params: {
                    'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
                  }
                })
              }),
              
              new ol.layer.Vector({
            	  title: 'Earthquakes',
            	  source: new ol.source.GeoJSON({
            	    url: 'http://leerstand.localhost/grazwiki/www/api/addresses_geojson.php?minx=15.3&maxx=15.4&miny=47.07&maxy=47.08',
            	    projection: 'EPSG:4326',
            	  }),
            	  //projection: new OpenLayers.Projection("EPSG:4326"),
            	  style: new ol.style.Style({
                    image: new ol.style.Circle({
                    radius: 3,
                    fill: new ol.style.Fill({color: 'red'})
                  })
              })
            }),
            new ol.layer.Tile({
                //extent: [977844.377599999, 5837774.6617, 1915609.8654, 6295560.8122],
                source: source
              })
            ];

            var map = new ol.Map({
              controls: ol.control.defaults().extend([
                new ol.control.ScaleLine({
                  units: 'degrees'
                })
              ]),
              layers: layers,
              target: 'map',
              view: new ol.View({
                projection: 'EPSG:4326',
                center: [15, 47],
                zoom: 10
              })
            });

