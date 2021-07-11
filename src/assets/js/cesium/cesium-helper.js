var __viewer

function cesium_create_viewer(element_id) {
    // Init cesium
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDJkYTdkNC0zNjMyLTQ2ZGEtOWIyYi1mZmY4NjkzZTZjMzYiLCJpZCI6Mjc0OTQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODk1NjM4NjN9.DnuUfE_kKiHoWyu2QkRGEclGDMNtW9253rVvDvnhbNQ';
    __viewer = new Cesium.Viewer(element_id, {
        sceneMode: Cesium.SceneMode.SCENE3D,
        baseLayerPicker: true,
        fullscreenButton: false,
        timeline: false,
        animation: false,
        vrButton: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        geocoder: true,
        selectionIndicator: true,
        infoBox: false,
        // targetFrameRate: 24,
        terrainProvider: Cesium.createWorldTerrain({
            requestVertexNormals: true
        })
    });

    // Hide underground entities
    __viewer.scene.globe.depthTestAgainstTerrain = true;

    // Remove default behavior
    __viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    __viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return __viewer
}


function utils_getCirclePoints(points, radius, center) {
    var coordinates = [];
    for (var i = 0; i < points; ++i) {
        var bearing = (2 * Math.PI * -i) / points
        coordinates.push(utils_getCirclePoints__offset(center, radius, bearing));
    }
    coordinates.push({lon: coordinates[0].lon, lat: coordinates[0].lat, alt: coordinates[0].alt})

    return coordinates
}

function utils_getCirclePoints__offset(center, radius, bearing) {
    var lat1 = Cesium.Math.toRadians(center.lat)
    var lon1 = Cesium.Math.toRadians(center.lon)
    var dByR = radius / 6378137; // distance divided by 6378137 (radius of the earth) wgs84

    var lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
    var lon = lon1 + Math.atan2(
        Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
        Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat)
    );

    return {lon: Cesium.Math.toDegrees(lon), lat: Cesium.Math.toDegrees(lat), alt: center.alt}
}


function utils_getGlobeHeight(lon, lat) {
    var cartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0)
    return __viewer.scene.globe.getHeight(cartographic)
}

function utils_correctAlt(lon, lat, alt, offset) {
    offset = offset ? offset : 0

    var globeHeight = utils_getGlobeHeight(lon, lat)
    if (globeHeight && globeHeight > 0) {
        return globeHeight + offset
    } else {
        return offset
    }
}

function utils_getCartesianFromMovement(position) {
    var ray = __viewer.camera.getPickRay(position);
    var cartesian = __viewer.scene.globe.pick(ray, __viewer.scene);

    return cartesian
}

function utils_getLonLatAltFromCartesian(cartesian) {
    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    var lon = Cesium.Math.toDegrees(cartographic.longitude)
    var lat = Cesium.Math.toDegrees(cartographic.latitude)
    var alt = cartographic.height

    return {lon, lat, alt}
}


function utils_dom_inputLonLat(target) {
    var value = target.val()

    value = value.replace(/^0+/, '')

    if (!value) {
        value = 0
    } else {
        value = value.match("^[-]?[0-9]+[.]?[0-9]*")
        if (!value) {
            value = 0
        } else {
            value = Number(value[0])
        }
    }

    if (!value) {
        target.val(0)
    }

    return value
}