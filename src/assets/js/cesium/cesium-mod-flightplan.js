var __cesium_mod_flightplan = null

// for lazy access
function get_cesium_mod_flightplan() {
    return __cesium_mod_flightplan || {}
}

// for initial access
function init_cesium_mod_flightplan(viewer, FLIGHTPLAN_OFFSET) {
    if (__cesium_mod_flightplan) return __cesium_mod_flightplan

    var point_entity
    var polygon_entity

    var _center, _points

    var _forceRedraw = false
    var _interval
    var _cartesian
    var _radius


    function map_renderLoc(cartesian, radius) {
        if (cartesian) {
            var center = utils_getLonLatAltFromCartesian(cartesian)
            var points = utils_getCirclePoints(32, radius, center)

            _center = center
            _points = points

            _forceRedraw = true
            _cartesian = cartesian
            _radius = radius

            if (!_interval) {
                _interval = setInterval(redraw, 20)
            }
        }
    }

    function map_changeRadius(radius) {
        if (_cartesian) {
            map_renderLoc(_cartesian, radius)
            _forceRedraw = true
        }
    }

    function map_changePosition(cartesian) {
        if (_radius) {
            map_renderLoc(cartesian, _radius)
            _forceRedraw = true
        }
    }

    function map_changeLonLat(lon, lat) {
        if (_center) {
            lon = lon || _center.lon
            lat = lat || _center.lat
            var alt = _center.alt

            var cartesian = Cesium.Cartesian3.fromDegrees(lon, lat, alt)

            map_renderLoc(cartesian, _radius)
            _forceRedraw = true
        }
    }

    function map_removeLoc() {
        _forceRedraw = false

        viewer.entities.remove(point_entity)
        viewer.entities.remove(polygon_entity)

        clearInterval(_interval)
        _interval = undefined
        _cartesian = undefined
        _radius = undefined
    }

    function map_flyToLoc() {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(_center.lon, _center.lat, viewer.camera.position.z),
            duration: 1.0,
        });
    }

    function redraw() {
        var diff1 = utils_fixCenterAlt(_center)
        var diff2 = utils_fixPointsAlt(_points)

        if (diff1 || diff2 || _forceRedraw) {
            viewer.entities.remove(point_entity)
            viewer.entities.remove(polygon_entity)

            point_entity = viewer.entities.add({
                name: "flightplan_center",
                position: utils_getCenterPosition(),
                point: {
                    pixelSize: 26,
                    color: Cesium.Color.ORANGE.withAlpha(0.5),
                    outlineColor: Cesium.Color.ORANGE,
                    outlineWidth: 1,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            })

            polygon_entity = viewer.entities.add({
                name: "flightplan_polygon",
                polygon: {
                    hierarchy: utils_getPointsPosition(),
                    extrudedHeight: 0,
                    perPositionHeight: true,
                    material: Cesium.Color.ORANGE.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.BLACK,
                    closeTop: false,
                    closeBottom: false,
                },
            })

            if (_forceRedraw) {
                _forceRedraw = false
            }
        }
    }

    function getCenterPosition() {
        return _center
    }

    function getPointsPosition() {
        return _points
    }

    function utils_fixCenterAlt() {
        var lon = _center.lon
        var lat = _center.lat
        var alt = _center.alt

        var new_alt = utils_correctAlt(lon, lat, alt, 0.0)

        _center.lon = lon
        _center.lat = lat
        _center.alt = new_alt

        return Math.abs(alt - new_alt) > 0.1
    }

    function utils_fixPointsAlt() {
        var has_diff = false

        _points.forEach(function (p) {
            var lon = p.lon
            var lat = p.lat
            var alt = p.alt

            var new_alt = utils_correctAlt(lon, lat, alt, FLIGHTPLAN_OFFSET)

            p.lon = lon
            p.lat = lat
            p.alt = new_alt

            if (has_diff === false && Math.abs(alt - new_alt) > 0.1) {
                has_diff = true
            }
        })

        return has_diff
    }

    function utils_getCenterPosition() {
        return Cesium.Cartesian3.fromDegrees(_center.lon, _center.lat, _center.alt)
    }

    function utils_getPointsPosition() {
        var polygon_pos = []
        _points.forEach(function (p) {
            polygon_pos.push(p.lon, p.lat, p.alt)
        })
        return Cesium.Cartesian3.fromDegreesArrayHeights(polygon_pos)
    }

    return __cesium_mod_flightplan = {
        map_flyToLoc: map_flyToLoc,
        map_renderLoc: map_renderLoc,
        map_removeLoc: map_removeLoc,
        map_changeRadius: map_changeRadius,
        map_changePosition: map_changePosition,
        getCenterPosition: getCenterPosition,
        map_changeLonLat: map_changeLonLat,
        getPointsPosition: getPointsPosition,
    }
}