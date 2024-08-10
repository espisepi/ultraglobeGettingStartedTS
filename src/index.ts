import * as THREE from "three";
import { Map, GoogleMap3DTileLayer, SingleImageElevationLayer, WMSLayer, OGC3DTilesLayer, PanController, RotateController, ZoomController, NOAAGFSCloudsLayer } from '@jdultra/ultra-globe';
import earthElevationImage from './images/earth_elevation.jpg';

let map = new Map({
    divID: 'screen',
    clock: true,
    shadows: false,
    debug: false,
    detailMultiplier: 1.0,
    ocean: false,
    atmosphere: true,
    atmosphereDensity: 1.0,
    sun: true,
    rings:false,
    space: true,

});

// Just showing off how to work with controller chain here. You can leave the original map.controller alone for default behaviour

map.controller.clear(); // clear existing controller chain

map.controller.append(new PanController(map.camera, map.domContainer, map));
map.controller.append(new RotateController(map.camera, map.domContainer, map));
map.controller.append(new ZoomController(map.camera, map.domContainer, map));



map.moveAndLookAt({ x: 13.42, y: 52.480, z: 300 }, { x: 13.42, y: 52.4895, z: 170 });

const earthElevation: SingleImageElevationLayer = new SingleImageElevationLayer({
    id: 0,
    name: "singleImageEarthElevation",
    bounds: [-180, -90, 180, 90],
    url: earthElevationImage,
    visible: true,
    min: -100,
    max: 8000
});
map.setLayer(earthElevation, 0);


const wmsLayer: WMSLayer = new WMSLayer({
    id: 1,
    name: "BlueMarble",
    bounds: [-180, -90, 180, 90],
    url: "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
    layer: "GEBCO_LATEST_SUB_ICE_TOPO",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    imageSize: 512
})
map.setLayer(wmsLayer, 1);

const ogc3dTiles: OGC3DTilesLayer = new OGC3DTilesLayer({
    id: 2,
    name: "OGC 3DTiles",
    visible: true,
    url: "https://storage.googleapis.com/ogc-3d-tiles/berlinTileset/tileset.json",
    longitude: 13.42,
    latitude: 52.4895,
    height: 172,
    rotationY: 0.72,
    rotationX: 3.1416,
    scale: 1.0,
    geometricErrorMultiplier: 0.03,
    loadOutsideView: false
});


map.setLayer(ogc3dTiles, 2);

var environmentLayer = new NOAAGFSCloudsLayer({
    id: 84,
    name: "clouds",
    quality: 0.5
});
map.setLayer(environmentLayer, 3);
//map.ultraClock.setDate(new Date(2023, 5, 21, 15, 0, 0, 0));

//uncomment to display Google Maps 3D Tiles. Don't forget to specify a valid Google Maps API key
var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "AIzaSyC3s30ikTs9ZqcRDbD74FV3gTG0CoddUbE",
    loadOutsideView: true,
    displayCopyright: true,
}); 
map.setLayer(googleMaps3DTiles, 4);




// The following code uses standard threejs to add a few polyline around the earth

type GeodeticPoint = {
    x: number;
    y: number;
    z: number;
};

const points: THREE.Vector3[] = [];
let geodeticPoint: GeodeticPoint = { x: 0, y: 0, z: 0 };

for (let i = 0; i < 201; i++) {
    geodeticPoint.x = (360 / 200) * i;
    // Assuming map.planet.llhToCartesian.forward returns a type that has x, y, z properties
    const cartesianPoint = map.planet.llhToCartesian.forward(geodeticPoint);
    points.push(new THREE.Vector3(cartesianPoint.x, cartesianPoint.y, cartesianPoint.z));
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
for (let i = 0; i < 100; i++) {
    const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0xcd2235,
            linewidth: 5, // Note: linewidth might not work as expected in WebGL
        })
    );
    line.rotateX(Math.random() * Math.PI);
    line.rotateY(Math.random() * Math.PI);
    line.rotateZ(Math.random() * Math.PI);
    const scale = 1 + Math.random() * 0.01;
    line.scale.set(scale, scale, scale);
    map.scene.add(line);
    // console.log(map)
}


/*

// Sepinaco code
function emitirEvento(data: any) {
    // Crear un nuevo evento personalizado con el nombre 'estadoCambiado'
    const evento = new CustomEvent('estadoCambiado', {
        detail: { estado: data } // Puedes pasar información adicional en el evento
    });

    // Emitir el evento en el objeto window (puede ser cualquier otro elemento)
    window.dispatchEvent(evento);
}

// Función que se ejecutará periódicamente
function chequearEstado() {
    // Aquí podrías cambiar el valor de ma
    // Ejemplo: ma = obtenerNuevoEstado();

    // Emitir el evento con el estado actual de ma
    emitirEvento(map);

    // Puedes actualizar la variable ma si es necesario
    // ma++;
}

// Configurar un intervalo para chequear el estado cada 2 segundos (2000 ms)
setInterval(chequearEstado, 2000);

// Escuchar el evento emitido
// window.addEventListener('estadoCambiado', (e:any) => {
//     console.log('El estado de map ha cambiado:', e.detail.estado);
// });



// Emitir eventos cada cierto tiempo del estado de la variable map


/*

// Variable cuyo estado queremos monitorear
let ma = 0;

// Función para emitir un evento
function emitirEvento(ma) {
    // Crear un nuevo evento personalizado con el nombre 'estadoCambiado'
    const evento = new CustomEvent('estadoCambiado', {
        detail: { estado: ma } // Puedes pasar información adicional en el evento
    });

    // Emitir el evento en el objeto window (puede ser cualquier otro elemento)
    window.dispatchEvent(evento);
}

// Función que se ejecutará periódicamente
function chequearEstado() {
    // Aquí podrías cambiar el valor de ma
    // Ejemplo: ma = obtenerNuevoEstado();

    // Emitir el evento con el estado actual de ma
    emitirEvento(ma);

    // Puedes actualizar la variable ma si es necesario
    // ma++;
}

// Configurar un intervalo para chequear el estado cada 2 segundos (2000 ms)
setInterval(chequearEstado, 2000);

// Escuchar el evento emitido
window.addEventListener('estadoCambiado', (e) => {
    console.log('El estado de ma ha cambiado:', e.detail.estado);
});




*/


