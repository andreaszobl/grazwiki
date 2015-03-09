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

var source_wmts = new ol.source.WMTS({
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


var projection_3857 = new ol.proj.Projection({
	  code: 'EPSG:3857',
	  //units: 'm'
});

var projection_4326 = new ol.proj.Projection({
	  code: 'EPSG:4326',
	  //units: 'm'
});


var geosource = new ol.source.GeoJSON({
	    url: '/api/addresses_geojson.php?minx=15.0&maxx=15.7&miny=46.90&maxy=47.10',
	    defaultProjection: 'EPSG:4326',
	    projection: 'EPSG:3857',
});



var geosource_bbox = new ol.source.ServerVector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection) {
    extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    var url = '/api/addresses_geojson.php?bbox=' + extent.join(',');
    $.ajax({
      url: url,
      //dataType: 'jsonp',
      success: function(data) {
        geosource.addFeatures(geosource.readFeatures(data));
        console.log(data);
      }
    });
  },
  strategy: ol.loadingstrategy.bbox,
  defaultProjection: 'EPSG:4326',
	projection: 'EPSG:3857',
});



var image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

var styles = {
  'Point': [new ol.style.Style({
    image: image
  })],
  'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiLineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiPoint': [new ol.style.Style({
    image: image
  })],
  'MultiPolygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })],
  'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'GeometryCollection': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  })],
  'Circle': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })]
};

var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

var vectorlayer = new ol.layer.Vector({
  source: geosource_bbox,
  style: styleFunction
});



var clusterSource = new ol.source.Cluster({
	  distance: 20,
	  source: geosource,
});

var styleCache = {};
var clusters = new ol.layer.Vector({
  source: clusterSource,
  style: function(feature, resolution) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      style = [new ol.style.Style({
        image: new ol.style.Circle({
          radius: 13,
          stroke: new ol.style.Stroke({
            color: '#fff'
          }),
          fill: new ol.style.Fill({
            color: '#3399CC'
          })
        }),
        text: new ol.style.Text({
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#fff'
          })
        })
      })];
      styleCache[size] = style;
    }
    return style;
  }
});


/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
}));



var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      //extent: [977844.377599999, 5837774.6617, 1915609.8654, 6295560.8122],
      source: source_wmts
    }),
    clusters,
    //  vectorlayer
  ],
  overlays: [overlay],
  target: 'map',
  
  interactions: ol.interaction.defaults().extend([
          new ol.interaction.Select({
            style: new ol.style.Style({
              image: new ol.style.Circle({
                radius: 15,
                fill: new ol.style.Fill({
                  color: '#44AADD'
                }),
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          })
        ]),
  
  view: new ol.View({
    //center: [1720000, 5955000],
    center: ol.proj.transform([15.397911071777, 47.070865631104], 'EPSG:4326', 'EPSG:3857'),
    projection: 'EPSG:3857',
    //projection: 'EPSG:4326',
    zoom: 14
  })
  
});


var displayFeatureInfo = function(pixel) {

  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    console.log(feature);
    return feature;
  });

  

};


function isCluster(feature) {
  if (!feature || !feature.get('features')) { return false; }
  return feature.get('features').length > 1;
}

map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) { return feature; });
  var features = feature.get('features');
  if (isCluster(feature)) {    
    // is a cluster, so loop through all the underlying features
    for(var i = 0; i < features.length; i++) {
      console.log(features[i].get('name'));
    }
  } else {
    // not a cluster
    //var features = features[0].get('features');
    
    var featurename = features[0].get('name');
    content.innerHTML = '<p>' + featurename + '</p>';
    
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    //console.log(coord[0]);
    overlay.setPosition(coord);
  }
});





//Mouse Position
var mousePositionControl = new ol.control.MousePosition({
  className:'ol-full-screen', //default parameter
  coordinateFormat:ol.coordinate.createStringXY(4), //This is the format we want the coordinate in. 
  //The number arguement in createStringXY is the number of decimal places.
  projection:"EPSG:4326", //This is the actual projection of the coordinates. 
  //Luckily, if our map is not native to the projection here, the coordinates will be transformed to the appropriate projection.
  className:"custom-mouse-position",
  target:undefined, //define a target if you have a div you want to insert into already,
  undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate.
});
map.addControl(mousePositionControl);



function onMoveEnd(evt) {
  var map = evt.map;
    
  var extent = map.getView().calculateExtent(map.getSize());
  var bottomLeft = ol.proj.transform(ol.extent.getBottomLeft(extent),
      'EPSG:3857', 'EPSG:4326');
  var topRight = ol.proj.transform(ol.extent.getTopRight(extent),
      'EPSG:3857', 'EPSG:4326');
/*
  display('left', wrapLon(bottomLeft[0]));
  display('bottom', bottomLeft[1]);
  display('right', wrapLon(topRight[0]));
  display('top', topRight[1]);
*/
  
  var message = {"type": "event", "name": "map_moved", "left": bottomLeft[0], "bottom": bottomLeft[1], "right": topRight[0], "top": topRight[1]};
  
  if (typeof dialog != 'undefined') {
    dialog.receiveText(JSON.stringify(message));
  }
  
  var input = document.getElementById("message_2");                            
  input.value = JSON.stringify(message);
 
  
}

map.on('moveend', onMoveEnd);





function CenterMap(lon, lat) {
    console.log("Lon: " + lon + " Lat: " + lat);
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(16);
}




/**
 * Add a click handler to the map to render the popup.
 */
 /*
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
      coordinate, 'EPSG:3857', 'EPSG:4326'));

  content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  console.log(hdms);
  overlay.setPosition(coordinate);
});
*/