var __cesium_mod_mission = null

// for lazy access
function get_cesium_mod_mission() {
    return __cesium_mod_mission || {}
}

// for initial access
function init_cesium_mod_mission(viewer, dom_mod_mission, INIT_OFFSET, INIT_SPEED, POV_OFFSET) {
    if (__cesium_mod_mission) return __cesium_mod_mission

    var map_point_label_ground_entities = {}
    var map_point_label_next_entities = {}

    var map_point_polyline_ground_entities = {}
    var map_point_polyline_next_entities = {}

    var map_point_entities = {}
    var map_point_positions = {}
    var map_point_offset = {}
    var map_point_ground_entities = {}
    var map_point_ground_positions = {}

    var map_point_pov_label_ground_entities = {}
    var map_point_pov_polyline_ground_entities = {}
    var map_point_pov_entities = {}
    var map_point_pov_positions = {}
    var map_point_pov_offset = {}
    var map_point_pov_ground_entities = {}
    var map_point_pov_ground_positions = {}

    var map_point_distance = {}
    var map_point_command = {}

    var map_point_speed = {}
    var map_point_delay = {}
    var map_point_heading = {}

    var map_home_point_entity = undefined
    var map_home_point_position = undefined

    var map_home_point_geocode_position = undefined
    var map_home_point_geocode_distance = 1000
    var map_home_point_geocode_result = undefined

    var map_home_point_weather_position = undefined
    var map_home_point_weather_distance = 50000
    var map_home_point_weather_result = undefined

    var NEXT_POINT_INDEX = 0 // DON'T TOUCH
    var CURR_POINT_INDEX = null
    var ADD_POV_MODE = false

    function utils_getNextPointIndex(point_index) {
        var keys = Object.keys(map_point_entities).map(x => x + "")
        var index = keys.indexOf(point_index + "")

        while (index < keys.length) {
            index++

            if (map_point_entities[keys[index]]) {
                return keys[index]
            }
        }
    }

    function utils_getPOVHeightLabel(pov_index) {
        var alt = ""
        if (map_point_pov_positions[pov_index]) {
            alt = map_point_pov_positions[pov_index].alt
            alt = alt.toFixed(0)
        }

        var offset = ""
        if (map_point_pov_offset[pov_index]) {
            offset = map_point_pov_offset[pov_index]
            offset = offset.toFixed(0)
        }

        var result = ""

        if (alt) {
            result += alt + "m"
        }

        if (offset) {
            result += "\n(" + offset + "m)"
        }


        return result
    }

    function utils_getHeightLabel(point_index) {
        var alt = ""
        if (map_point_positions[point_index]) {
            alt = map_point_positions[point_index].alt
            alt = alt.toFixed(0)
        }

        var offset = ""
        if (map_point_offset[point_index]) {
            offset = map_point_offset[point_index]
            offset = offset.toFixed(0)
        }

        var result = ""

        if (offset) {
            result += offset + " m"
        }

        if (alt) {
            result += "\n" + alt + " MSL"
        }

        return result
    }

    // POINT
    function map_addPoint(lon, lat, alt, offset, speed, delay, heading, command, pov) {
        var point_index = NEXT_POINT_INDEX

        if (!map_point_entities[point_index]) {
            offset = offset ? offset : INIT_OFFSET
            speed = speed ? speed : INIT_SPEED
            delay = delay ? delay : 0
            heading = heading ? heading : 0
            command = command ? command : "Waypoint"

            var scratch = new Cesium.Cartographic();
            var geodesic = new Cesium.EllipsoidGeodesic();

            // initial pos for point_ground
            map_point_ground_positions["ground" + point_index] = {
                lon: lon,
                lat: lat,
                alt: 0
            }

            // initial pos for point
            map_point_positions[point_index] = {
                lon: lon,
                lat: lat,
                alt: alt
            }

            // initial offset for point
            map_point_offset[point_index] = offset ? offset : INIT_OFFSET
            map_point_speed[point_index] = speed ? speed : INIT_SPEED
            map_point_heading[point_index] = heading ? heading : 0
            map_point_command[point_index] = command ? command : "Waypoint"
            map_point_delay[point_index] = delay ? delay : 0
            map_point_distance[point_index] = 0

            // line between point and point_ground
            map_point_polyline_ground_entities[point_index] = viewer.entities.add({
                polyline: {
                    width: 1,
                    positions: new Cesium.CallbackProperty(function () {
                        if (!map_point_positions[point_index])
                            return

                        if (!map_point_ground_positions["ground" + point_index])
                            return

                        var lon1 = map_point_positions[point_index].lon
                        var lat1 = map_point_positions[point_index].lat
                        var alt1 = map_point_positions[point_index].alt

                        var lon2 = map_point_ground_positions["ground" + point_index].lon
                        var lat2 = map_point_ground_positions["ground" + point_index].lat
                        var alt2 = map_point_ground_positions["ground" + point_index].alt

                        if (alt1 > alt2) {
                            return Cesium.Cartesian3.fromDegreesArrayHeights(
                                [lon1, lat1, alt1, lon2, lat2, alt2],
                            );
                        }
                    }),
                    material: Cesium.Color.YELLOW,
                },
            })

            // label the polyline with calculated height.
            map_point_label_ground_entities[point_index] = viewer.entities.add({
                position: new Cesium.CallbackProperty(function (time, result) {
                    if (map_point_polyline_ground_entities[point_index]) {
                        var line = map_point_polyline_ground_entities[point_index]
                        var pos = line.polyline.positions.getValue(time, result)

                        if (pos) {
                            var startPoint = pos[1];
                            var endPoint = pos[0];

                            var startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
                            var endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

                            geodesic.setEndPoints(startCartographic, endCartographic);
                            var midpointCartographic = geodesic.interpolateUsingFraction(
                                0.5,
                                scratch
                            );

                            return Cesium.Cartesian3.fromRadians(
                                midpointCartographic.longitude,
                                midpointCartographic.latitude,
                                startCartographic.height + map_point_offset[point_index] / 2
                            );
                        }
                    }
                }),
                label: {
                    // This callback updates the length to print each frame.
                    show: true,
                    font: "14px arial",
                    text: new Cesium.CallbackProperty(function () {
                        return utils_getHeightLabel(point_index)
                    }),
                    fillColor: Cesium.Color.WHITE,
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 120),
                    pixelOffset: new Cesium.Cartesian2(50, 0),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    translucencyByDistance: new Cesium.NearFarScalar(3000, 1.0, 3000, 0.0),
                    disableDepthTestDistance: 10,
                    outlineWidth: 3,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                },
            });

            // line between point and next point
            map_point_polyline_next_entities[point_index] = viewer.entities.add({
                polyline: {
                    width: 3,
                    positions: new Cesium.CallbackProperty(function () {
                        if (!map_point_positions[point_index])
                            return

                        var next_point_index = utils_getNextPointIndex(point_index)
                        if (!map_point_positions[next_point_index])
                            return

                        var lon1 = map_point_positions[point_index].lon
                        var lat1 = map_point_positions[point_index].lat
                        var alt1 = map_point_positions[point_index].alt

                        var lon2 = map_point_positions[next_point_index].lon
                        var lat2 = map_point_positions[next_point_index].lat
                        var alt2 = map_point_positions[next_point_index].alt

                        if (alt1 && alt2) {
                            return Cesium.Cartesian3.fromDegreesArrayHeights(
                                [lon1, lat1, alt1, lon2, lat2, alt2],
                            );
                        }
                    }),
                    material: Cesium.Color.YELLOW,
                },
            })

            // label the polyline with calculated distance.
            map_point_label_next_entities[point_index] = viewer.entities.add({
                position: new Cesium.CallbackProperty(function (time, result) {
                    if (map_point_polyline_next_entities[point_index]) {
                        var line = map_point_polyline_next_entities[point_index]
                        var pos = line.polyline.positions.getValue(time, result)

                        if (pos) {
                            var startPoint = pos[1];
                            var endPoint = pos[0];

                            var startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
                            var endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

                            geodesic.setEndPoints(startCartographic, endCartographic);
                            var midpointCartographic = geodesic.interpolateUsingFraction(
                                0.5,
                                scratch
                            );

                            var min = Math.min(startCartographic.height, endCartographic.height)
                            var max = Math.max(startCartographic.height, endCartographic.height)
                            var diff = (max - min)
                            var height = min + diff / 2

                            return Cesium.Cartesian3.fromRadians(
                                midpointCartographic.longitude,
                                midpointCartographic.latitude,
                                height
                            );
                        }
                    }
                }),
                label: {
                    // This callback updates the length to print each frame.
                    show: true,
                    font: "14px arial",
                    text: new Cesium.CallbackProperty(function (time, result) {
                        if (map_point_polyline_next_entities[point_index]) {
                            var line = map_point_polyline_next_entities[point_index]
                            var pos = line.polyline.positions.getValue(time, result)

                            if (pos) {
                                var startPoint = pos[1];
                                var endPoint = pos[0];

                                var startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
                                var endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

                                geodesic.setEndPoints(startCartographic, endCartographic);

                                if (map_point_distance[point_index] != geodesic.surfaceDistance) {
                                    map_point_distance[point_index] = geodesic.surfaceDistance
                                    dom_mod_mission.dom_setDistanceAndDuration(map_getDistanceAndDuration())
                                }

                                return (geodesic.surfaceDistance).toFixed(0) + "m";
                            }
                        }
                    }),
                    fillColor: Cesium.Color.WHITE,
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 120),
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    translucencyByDistance: new Cesium.NearFarScalar(3000, 1.0, 3000, 0.0),
                    disableDepthTestDistance: 10,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 3,
                },
            })

            // point_ground entity
            map_point_ground_entities["ground" + point_index] = viewer.entities.add({
                name: "ground" + point_index,
                position: new Cesium.CallbackProperty(function () {
                    if (map_point_ground_positions["ground" + point_index]) {
                        var lon = map_point_ground_positions["ground" + point_index].lon
                        var lat = map_point_ground_positions["ground" + point_index].lat

                        var alt = utils_correctAlt(lon, lat, 0.0, 0.0)

                        map_point_ground_positions["ground" + point_index].alt = alt

                        return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                    }
                }),
                point: {
                    pixelSize: 26,
                    color: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.fromBytes(90, 90, 90, 100)
                        } else {
                            return Cesium.Color.fromBytes(197, 197, 197, 100)
                        }
                    }),
                    outlineColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.WHITE
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    outlineWidth: 1,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            })

            // point entity
            map_point_entities[point_index] = viewer.entities.add({
                name: point_index,
                position: new Cesium.CallbackProperty(function () {
                    if (map_point_positions[point_index] && map_point_ground_positions["ground" + point_index]) {
                        // point_ground as source of lat lon
                        var lon = map_point_ground_positions["ground" + point_index].lon
                        var lat = map_point_ground_positions["ground" + point_index].lat

                        var alt = map_point_positions[point_index].alt
                        var offset = map_point_offset[point_index]

                        if (offset < 0) {
                            offset = 0
                        }

                        alt = utils_correctAlt(lon, lat, alt, offset)

                        if (
                            map_point_positions[point_index].lon != lon ||
                            map_point_positions[point_index].lat != lat
                        ) {
                            map_point_positions[point_index].lon = lon
                            map_point_positions[point_index].lat = lat
                        }

                        if (map_point_positions[point_index].alt != alt) {
                            map_point_positions[point_index].alt = alt
                        }

                        if (map_point_offset[point_index] != offset) {
                            map_point_offset[point_index] = offset

                            dom_mod_mission.dom_setPointOffset(point_index, offset)
                        }

                        return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                    }
                }),
                point: {
                    pixelSize: 20,
                    color: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.DIMGREY
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    outlineColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.WHITE
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    outlineWidth: 1,
                    // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                label: {
                    show: true,
                    font: "12px arial",
                    text: new Cesium.CallbackProperty(function () {
                        return map_getPointLabel(point_index)
                    }),
                    showBackground: true,
                    backgroundColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.DIMGREY
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    backgroundPadding: new Cesium.Cartesian2(2, 2),
                    pixelOffset: new Cesium.Cartesian2(1, 0),
                    fillColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == point_index) {
                            return Cesium.Color.WHITE
                        } else {
                            return Cesium.Color.BLACK
                        }
                    }),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            })

            dom_mod_mission.dom_addPoint(NEXT_POINT_INDEX, lon, lat, alt, offset, speed, delay, heading, command)
            dom_mod_mission.dom_setPointsTitle(map_getPointLabels())
            dom_mod_mission.dom_setPointsCount(Object.keys(map_point_entities).length)
            dom_mod_mission.dom_setDistanceAndDuration(map_getDistanceAndDuration())

            if (pov) {
                map_addPOVPoint(pov.lon, pov.lat, pov.alt, pov.offset, point_index)
            }

            NEXT_POINT_INDEX += 1
        }
    }

    function map_removePoint(point_index) {
        map_removePOVPoint(point_index)

        viewer.entities.remove(map_point_polyline_ground_entities[point_index])
        viewer.entities.remove(map_point_polyline_next_entities[point_index])
        viewer.entities.remove(map_point_label_ground_entities[point_index])
        viewer.entities.remove(map_point_label_next_entities[point_index])
        viewer.entities.remove(map_point_ground_entities["ground" + point_index])
        viewer.entities.remove(map_point_entities[point_index])

        delete map_point_polyline_ground_entities[point_index]
        delete map_point_polyline_next_entities[point_index]
        delete map_point_label_ground_entities[point_index]
        delete map_point_label_next_entities[point_index]

        delete map_point_ground_entities["ground" + point_index]
        delete map_point_ground_positions["ground" + point_index]

        delete map_point_entities[point_index]
        delete map_point_positions[point_index]
        delete map_point_distance[point_index]
        delete map_point_offset[point_index]
        delete map_point_speed[point_index]
        delete map_point_command[point_index]

        delete map_point_delay[point_index]
        delete map_point_heading[point_index]


        dom_mod_mission.dom_setDistanceAndDuration(map_getDistanceAndDuration())
        dom_mod_mission.dom_setPointsTitle(map_getPointLabels())
        dom_mod_mission.dom_setPointsCount(dom_mod_mission.dom_setPointsCount(Object.keys(map_point_entities).length))
        dom_mod_mission.dom_removePoint(point_index)
    }

    function map_hasPoint(point_index) {
        return map_point_entities[point_index] != undefined
    }

    function map_getPointLabel(point_index) {
        var keys = Object.keys(map_point_entities).map(x => x + "")
        var index = keys.indexOf(point_index + "")
        return index == -1 ? "" : (index + 1) + ""
    }

    // POV
    function map_addPOVPoint(lon, lat, alt, offset, point_index) {
        if (ADD_POV_MODE && CURR_POINT_INDEX !== null && CURR_POINT_INDEX !== undefined) {
            point_index = CURR_POINT_INDEX
        }

        if (point_index !== null && point_index !== undefined) {
            if (!map_point_pov_entities["pov" + point_index]) {
                var scratch = new Cesium.Cartographic();
                var geodesic = new Cesium.EllipsoidGeodesic();

                // initial pos for pov point_ground
                map_point_pov_ground_positions["pov_ground" + point_index] = {
                    lon: lon,
                    lat: lat,
                    alt: 0
                }

                // initial pos for pov point
                map_point_pov_positions["pov" + point_index] = {
                    lon: lon,
                    lat: lat,
                    alt: alt
                }

                // initial pos for pov point
                map_point_pov_offset["pov" + point_index] = offset ? offset : POV_OFFSET

                // pov point_ground entity
                map_point_pov_ground_entities["pov_ground" + point_index] = viewer.entities.add({
                    name: "pov_ground" + point_index,
                    position: new Cesium.CallbackProperty(function () {
                        if (map_point_pov_ground_positions["pov_ground" + point_index]) {
                            var lon = map_point_pov_ground_positions["pov_ground" + point_index].lon
                            var lat = map_point_pov_ground_positions["pov_ground" + point_index].lat

                            var alt = utils_correctAlt(lon, lat, 0.0, 0.0)

                            map_point_pov_ground_positions["pov_ground" + point_index].alt = alt

                            return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                        }
                    }),
                    point: {
                        pixelSize: 26,
                        color: new Cesium.CallbackProperty(function () {
                            if (CURR_POINT_INDEX == point_index) {
                                return Cesium.Color.fromBytes(90, 90, 90, 100)
                            } else {
                                return Cesium.Color.fromBytes(197, 197, 197, 100)
                            }
                        }),
                        outlineColor: new Cesium.CallbackProperty(function () {
                            if (CURR_POINT_INDEX == point_index) {
                                return Cesium.Color.WHITE
                            } else {
                                return Cesium.Color.BLUE
                            }
                        }),
                        outlineWidth: 1,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    },
                })

                // line between point and point_ground
                map_point_pov_polyline_ground_entities["pov" + point_index] = viewer.entities.add({
                    polyline: {
                        width: 1,
                        positions: new Cesium.CallbackProperty(function () {
                            if (!map_point_pov_positions["pov" + point_index])
                                return

                            if (!map_point_pov_ground_positions["pov_ground" + point_index])
                                return

                            var lon1 = map_point_pov_positions["pov" + point_index].lon
                            var lat1 = map_point_pov_positions["pov" + point_index].lat
                            var alt1 = map_point_pov_positions["pov" + point_index].alt

                            var lon2 = map_point_pov_ground_positions["pov_ground" + point_index].lon
                            var lat2 = map_point_pov_ground_positions["pov_ground" + point_index].lat
                            var alt2 = map_point_pov_ground_positions["pov_ground" + point_index].alt

                            if (alt1 > alt2) {
                                return Cesium.Cartesian3.fromDegreesArrayHeights(
                                    [lon1, lat1, alt1, lon2, lat2, alt2],
                                );
                            }
                        }),
                        material: Cesium.Color.BLUE,
                    },
                })

                // label the polyline with calculated height.
                map_point_pov_label_ground_entities[point_index] = viewer.entities.add({
                    position: new Cesium.CallbackProperty(function (time, result) {
                        if (map_point_pov_polyline_ground_entities["pov" + point_index]) {
                            var line = map_point_pov_polyline_ground_entities["pov" + point_index]
                            var pos = line.polyline.positions.getValue(time, result)

                            if (pos) {
                                var startPoint = pos[1];
                                var endPoint = pos[0];

                                var startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
                                var endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

                                geodesic.setEndPoints(startCartographic, endCartographic);
                                var midpointCartographic = geodesic.interpolateUsingFraction(
                                    0.5,
                                    scratch
                                );

                                return Cesium.Cartesian3.fromRadians(
                                    midpointCartographic.longitude,
                                    midpointCartographic.latitude,
                                    startCartographic.height + map_point_pov_offset["pov" + point_index] / 2
                                );
                            }
                        }
                    }),
                    label: {
                        // This callback updates the length to print each frame.
                        show: true,
                        font: "14px arial",
                        text: new Cesium.CallbackProperty(function () {
                            return utils_getPOVHeightLabel("pov" + point_index)
                        }),
                        fillColor: Cesium.Color.WHITE,
                        showBackground: true,
                        backgroundColor: Cesium.Color.fromBytes(90, 90, 90, 120),
                        pixelOffset: new Cesium.Cartesian2(50, 0),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        translucencyByDistance: new Cesium.NearFarScalar(1000, 1.0, 1000, 0.0),
                        disableDepthTestDistance: 10,
                        outlineWidth: 2,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    },
                });

                // pov point entity
                map_point_pov_entities["pov" + point_index] = viewer.entities.add({
                    name: "pov" + point_index,
                    position: new Cesium.CallbackProperty(function () {
                        if (map_point_pov_positions["pov" + point_index] && map_point_pov_ground_positions["pov_ground" + point_index]) {
                            // point_ground as source of lat lon
                            var lon = map_point_pov_ground_positions["pov_ground" + point_index].lon
                            var lat = map_point_pov_ground_positions["pov_ground" + point_index].lat

                            var alt = map_point_pov_positions["pov" + point_index].alt
                            var offset = map_point_pov_offset["pov" + point_index]

                            if (offset < 0) {
                                offset = 0
                            }

                            alt = utils_correctAlt(lon, lat, alt, offset)

                            if (
                                map_point_pov_positions["pov" + point_index].lon != lon ||
                                map_point_pov_positions["pov" + point_index].lat != lat
                            ) {
                                map_point_pov_positions["pov" + point_index].lon = lon
                                map_point_pov_positions["pov" + point_index].lat = lat
                            }

                            if (map_point_pov_positions["pov" + point_index].alt != alt) {
                                map_point_pov_positions["pov" + point_index].alt = alt
                            }

                            if (map_point_pov_offset["pov" + point_index] != offset) {
                                map_point_pov_offset["pov" + point_index] = offset

                                dom_mod_mission.dom_setPOVPointOffset(point_index, offset)
                            }

                            return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                        }
                    }),
                    point: {
                        pixelSize: 20,
                        color: new Cesium.CallbackProperty(function () {
                            if (CURR_POINT_INDEX == point_index) {
                                return Cesium.Color.DIMGREY
                            } else {
                                return Cesium.Color.BLUE
                            }
                        }),
                        outlineColor: Cesium.Color.BLUE,
                        outlineWidth: 1,
                    },
                    label: {
                        show: true,
                        font: "12px arial",
                        text: new Cesium.CallbackProperty(function () {
                            return map_getPointLabel(point_index)
                        }),
                        showBackground: true,
                        backgroundColor: new Cesium.CallbackProperty(function () {
                            if (CURR_POINT_INDEX == point_index) {
                                return Cesium.Color.DIMGREY
                            } else {
                                return Cesium.Color.BLUE
                            }
                        }),
                        backgroundPadding: new Cesium.Cartesian2(2, 2),
                        pixelOffset: new Cesium.Cartesian2(1, 0),
                        fillColor: Cesium.Color.WHITE,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    },
                })

                dom_mod_mission.dom_addPOVPoint(point_index, lon, lat, map_point_pov_offset["pov" + point_index])
            }
        }
    }

    function map_removePOVPoint(point_index) {
        viewer.entities.remove(map_point_pov_ground_entities["pov_ground" + point_index])
        viewer.entities.remove(map_point_pov_entities["pov" + point_index])
        viewer.entities.remove(map_point_pov_polyline_ground_entities["pov" + point_index])
        viewer.entities.remove(map_point_pov_label_ground_entities["pov" + point_index])

        delete map_point_pov_entities["pov" + point_index]
        delete map_point_pov_positions["pov" + point_index]
        delete map_point_pov_offset["pov" + point_index]
        delete map_point_pov_ground_entities["pov" + point_index]
        delete map_point_pov_ground_positions["pov" + point_index]
        delete map_point_pov_polyline_ground_entities["pov" + point_index]
        delete map_point_pov_label_ground_entities["pov" + point_index]

        dom_mod_mission.dom_removePOVPoint(point_index)
    }

    function map_hasPOVPoint(pov_index) {
        return map_point_pov_entities[pov_index] != undefined
    }

    function map_hasPOVGroundPoint(pov_index) {
        return map_point_pov_ground_entities[pov_index] != undefined
    }

    function map_setPOVGroundPointPositions(pov_index, lon, lat, dom_sync) {
        if (!lon) lon = map_point_pov_ground_positions[pov_index].lon
        if (!lat) lat = map_point_pov_ground_positions[pov_index].lat

        if (
            map_point_pov_ground_positions[pov_index].lon != lon ||
            map_point_pov_ground_positions[pov_index].lat != lat
        ) {
            map_point_pov_ground_positions[pov_index].lon = lon
            map_point_pov_ground_positions[pov_index].lat = lat
        }

        if (dom_sync) {
            dom_mod_mission.dom_setPOVPointLonLat(pov_index, lon, lat)
        }
    }

    function map_setPOVPointOffset(pov_index, value, dom_sync) {
        if (map_point_pov_offset[pov_index] != value) {
            map_point_pov_offset[pov_index] = value
        }

        if (dom_sync) {
            dom_mod_mission.dom_setPOVPointOffset(pov_index, value)
        }
    }

    function map_getPOVPointOffset(pov_index) {
        return map_point_pov_offset[pov_index]
    }

    function map_getAddPOVMode() {
        return ADD_POV_MODE
    }

    function map_setAddPOVMode(mode) {
        return ADD_POV_MODE = mode
    }

    // offset
    function map_getPointOffset(point_index) {
        return map_point_offset[point_index]
    }

    function map_setPointOffset(point_index, value, dom_sync) {
        if (map_point_offset[point_index] != value) {
            map_point_offset[point_index] = value
        }

        if (dom_sync) {
            dom_mod_mission.dom_setPointOffset(point_index, value)
        }
    }

    // speed
    function map_getPointSpeed(point_index) {
        return map_point_speed[point_index]
    }

    function map_setPointSpeed(point_index, value) {
        if (map_point_speed[point_index] != value) {
            map_point_speed[point_index] = value
            dom_mod_mission.dom_setDistanceAndDuration(map_getDistanceAndDuration())
        }
    }

    // delay
    function map_setPointDelay(point_index, value) {
        if (map_point_delay[point_index] != value) {
            map_point_delay[point_index] = value
            dom_mod_mission.dom_setDistanceAndDuration(map_getDistanceAndDuration())
        }
    }

    // heading
    function map_setPointHeading(point_index, value) {
        if (map_point_heading[point_index] != value) {
            map_point_heading[point_index] = value
        }
    }

    // command
    function map_setPointCommand(point_index, value) {
        if (map_point_command[point_index] != value) {
            map_point_command[point_index] = value
            dom_mod_mission.dom_setPointsTitle(map_getPointLabels())
        }
    }

    // HOME POINT
    function map_addHomePoint(lon, lat, alt, address) {
        if (!map_home_point_entity) {

            // initial pos for point
            map_home_point_position = {
                lon: lon,
                lat: lat,
                alt: alt
            }

            // prevent first geocode, if address exist
            if (address) {
                map_home_point_geocode_position = {
                    lon: lon,
                    lat: lat,
                    alt: alt
                }
                map_home_point_geocode_result = address
            }

            map_home_point_entity = viewer.entities.add({
                name: "home",
                position: new Cesium.CallbackProperty(function () {
                    if (map_home_point_position) {
                        // point_ground as source of lat lon
                        var lon = map_home_point_position.lon
                        var lat = map_home_point_position.lat
                        var alt = map_home_point_position.alt

                        alt = utils_correctAlt(lon, lat, alt, 0)

                        if (
                            map_home_point_position.lon != lon ||
                            map_home_point_position.lat != lat ||
                            map_home_point_position.alt != alt
                        ) {
                            map_home_point_position.lon = lon
                            map_home_point_position.lat = lat
                            map_home_point_position.alt = alt

                            map_getHomePointAddress()
                            map_getHomePointWeather()

                            dom_mod_mission.dom_setHomeLonLat(lon, lat)
                        }

                        return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                    }
                }),
                point: {
                    pixelSize: 30,
                    color: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == "home") {
                            return Cesium.Color.fromBytes(90, 90, 90, 100)
                        } else {
                            return Cesium.Color.fromBytes(197, 197, 197, 100)
                        }
                    }),
                    outlineColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == "home") {
                            return Cesium.Color.WHITE
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    outlineWidth: 1,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                label: {
                    show: true,
                    font: "9px arial",
                    text: "HOME",
                    backgroundPadding: new Cesium.Cartesian2(2, 2),
                    pixelOffset: new Cesium.Cartesian2(1, 0),
                    fillColor: new Cesium.CallbackProperty(function () {
                        if (CURR_POINT_INDEX == "home") {
                            return Cesium.Color.WHITE
                        } else {
                            return Cesium.Color.YELLOW
                        }
                    }),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            })

            dom_mod_mission.dom_setHomeLonLat(lon, lat)
            dom_mod_mission.dom_setHomeAddress(address)

            viewer.flyTo(map_home_point_entity, {
                offset: new Cesium.HeadingPitchRange(0.0, -1.45, 3500.0),
                duration: 1.0,
            })
        }
    }

    function map_removeHomePoint() {
        viewer.entities.remove(map_home_point_entity)

        map_home_point_entity = undefined
        map_home_point_position = undefined

        map_home_point_geocode_position = undefined
        map_home_point_weather_position = undefined
        map_home_point_weather_result = undefined
        map_home_point_geocode_result = undefined

        dom_mod_mission.dom_setHomeWeather(0)
        dom_mod_mission.dom_setHomeLonLat(0, 0)
        dom_mod_mission.dom_setHomeAddress("")
    }

    function map_hasHomePoint() {
        return map_home_point_entity != undefined
    }

    function map_setHomePointPosition(lon, lat) {
        if (
            map_home_point_position.lon != lon ||
            map_home_point_position.lat != lat
        ) {
            map_home_point_position.lon = lon
            map_home_point_position.lat = lat
        }
    }

    function map_getHomePointAddress(force) {
        var geodesic = new Cesium.EllipsoidGeodesic();

        if (map_home_point_position) {
            var lon = map_home_point_position.lon
            var lat = map_home_point_position.lat
            var alt = map_home_point_position.alt

            if (!map_home_point_geocode_position || force) {
                map_home_point_geocode_position = {
                    lon: lon,
                    lat: lat,
                    alt: alt,
                }

                gmap_getLocations({lat: lat, lng: lon})
                    .then(function (result) {
                        map_home_point_geocode_result = result.fullName

                        dom_mod_mission.dom_setHomeAddress(result.fullName)
                    })
            } else {
                var lon_g = map_home_point_geocode_position.lon
                var lat_g = map_home_point_geocode_position.lat
                var alt_g = map_home_point_geocode_position.alt

                var startCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), alt)
                var endCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon_g), Cesium.Math.toRadians(lat_g), alt_g);

                geodesic.setEndPoints(startCartographic, endCartographic);

                if (geodesic.surfaceDistance > map_home_point_geocode_distance) {
                    map_home_point_geocode_position = undefined
                }
            }
        }
    }

    function map_getHomePointWeather(force) {
        var geodesic = new Cesium.EllipsoidGeodesic();

        if (map_home_point_position) {
            var lon = map_home_point_position.lon
            var lat = map_home_point_position.lat
            var alt = map_home_point_position.alt

            if (!map_home_point_weather_position || force) {
                map_home_point_weather_position = {
                    lon: lon,
                    lat: lat,
                    alt: alt,
                }

                airmap_getWeather({lat: lat, lng: lon})
                    .then(function (response) {
                        if (response && response.data && response.data.weather) {
                            var info = response.data.weather[0]

                            dom_mod_mission.dom_setHomeWeather(info.temperature)
                            map_home_point_weather_result = info.temperature
                        }
                    })
            } else {
                var lon_g = map_home_point_weather_position.lon
                var lat_g = map_home_point_weather_position.lat
                var alt_g = map_home_point_weather_position.alt

                var startCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), alt)
                var endCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(lon_g), Cesium.Math.toRadians(lat_g), alt_g);

                geodesic.setEndPoints(startCartographic, endCartographic);

                if (geodesic.surfaceDistance > map_home_point_weather_distance) {
                    map_home_point_weather_position = undefined
                }
            }
        }
    }


    // GROUND POINT
    function map_hasGroundPoint(point_index) {
        return map_point_ground_entities[point_index] != undefined
    }

    function map_setGroundPointPositions(point_index, lon, lat, dom_sync) {
        if (!lon) lon = map_point_ground_positions[point_index].lon
        if (!lat) lat = map_point_ground_positions[point_index].lat

        if (
            map_point_ground_positions[point_index].lon != lon ||
            map_point_ground_positions[point_index].lat != lat
        ) {
            map_point_ground_positions[point_index].lon = lon
            map_point_ground_positions[point_index].lat = lat
        }

        if (dom_sync) {
            dom_mod_mission.dom_setPointLonLat(point_index, lon, lat)
        }
    }

    // SCREENSHOT
    function map_takeScreenshot(withoutZoom) {
        var cropSize = 300

        return new Promise(function (resolve, reject) {
            if (map_home_point_entity) {

                // console.log(viewer.camera.positionWC)

                viewer.flyTo(map_home_point_entity, {
                    offset: new Cesium.HeadingPitchRange(0.0, -1.45, 3500.0),
                    duration: 1.0,
                }).then(function () {
                    viewer.render();
                    viewer.canvas.toBlob(function (blob) {
                        var canvas = document.getElementById("cropCanvas");
                        canvas.width = cropSize
                        canvas.height = cropSize

                        var ctx = canvas.getContext("2d");

                        var url = URL.createObjectURL(blob);
                        var img = document.createElement("img")

                        img.src = url
                        img.onload = function () {
                            var w = img.width
                            var h = img.height

                            var sx = (w - h) / 2 // Start crop post
                            var sy = 0
                            var sw = h // Crop width
                            var sh = h

                            var dx = 0
                            var dy = 0
                            var dw = cropSize
                            var dh = cropSize

                            ctx.drawImage(img,
                                sx, sy, sw, sh,
                                dx, dy, dw, dh,
                            )
                        }

                        setTimeout(function () {
                            canvas.toBlob(function (blob) {
                                resolve(blob)
                            })
                        }, 150)
                    });
                })
            }
        })
    }


    function map_getPointLabels() {
        var keys = Object.keys(map_point_distance)
        var labels = {}

        keys.forEach(function (key) {
            labels[key] = map_getPointLabel(key)
        })

        return labels
    }

    function map_getDistanceAndDuration() {
        var keys = Object.keys(map_point_distance)
        var distance = 0
        var duration = 0

        keys.forEach(function (key) {
            distance += map_point_distance[key]

            duration += (map_point_distance[key] / map_point_speed[key]) + map_point_delay[key]
        })

        return {distance, duration}
    }

    function map_setCurrentIndex(index) {
        if (CURR_POINT_INDEX != index) {
            CURR_POINT_INDEX = index

            if (index == null || index == "home") {
                dom_mod_mission.dom_collapseAllPoints(null)
            } else {
                dom_mod_mission.dom_collapseShowPoint(index)
            }
        }
    }

    function map_destroy() {
        var keys = Object.keys(map_point_distance)
        keys.forEach(function (key) {
            map_removePoint(key)
        })
        map_removeHomePoint()

        NEXT_POINT_INDEX = 0 // DON'T TOUCH
        CURR_POINT_INDEX = null
    }

    // UTILS
    function js_createMission() {
        var keys = Object.keys(map_point_entities)

        var actions = keys.map(function (key) {
            var pov_coordinate = undefined
            var pov_offset = undefined

            if (map_point_pov_positions["pov" + key]) {
                pov_coordinate = map_point_pov_positions["pov" + key]
            }

            if (map_point_pov_offset["pov" + key]) {
                pov_offset = map_point_pov_offset["pov" + key]
            }

            return js_createWaypoint({
                lat: map_point_positions[key].lat,
                lon: map_point_positions[key].lon,
                alt: map_point_positions[key].alt,
                delay: map_point_delay[key],
                offset: map_point_offset[key],
                heading: map_point_heading[key],
                speed: map_point_speed[key],
                command: map_point_command[key],
            }, pov_coordinate, pov_offset)
        })

        var defaults = {
            defaultAltitude: 0,
            defaultDelay: 0,
            defaultHeading: 0,
            defaultSpeed: 0,
            defaultDistance: 0, // How it must work ?
            defaultOverlap: 0, // How it must work ?
            defaultRadius: 0,  // How it must work ?
            defaultWidth: 0,  // How it must work ?
        }

        return {
            actions: actions,
            "defaultFrame": "Home",
            "creationTime": new Date().toISOString(),
            "defaultAngle": 0,
            "defaultAngleOfView": [
                150,
                85
            ],
            "defaultCameraName": "",
            "defaultCameraResolution": [
                1280,
                720
            ],
            "defaultAltitude": defaults.defaultAltitude,
            "defaultDelay": defaults.defaultDelay,
            "defaultDistance": defaults.defaultDistance,
            "defaultHeading": defaults.defaultHeading,
            "defaultOverlap": defaults.defaultOverlap,
            "defaultRadius": defaults.defaultRadius,
            "defaultSpeed": defaults.defaultSpeed,
            "defaultWidth": defaults.defaultWidth,
            "home": {
                "coordinate": [
                    map_home_point_position.lat,
                    map_home_point_position.lon,
                ],
                "version": 1
            },
            "name": map_home_point_geocode_result,
            "rallys": [],
            "version": 1
        }
    }

    function js_createWaypoint(point, pov_coordinate, pov_offset) {
        var waypoint = {
            "command": point.command,
            "coordinate": [
                point.lat,
                point.lon,
                point.alt
            ],
            "delay": point.delay,
            "elevation": point.offset,
            "frame": "Home",
            "heading": point.heading,
            "radius": 0,
            "speed": point.speed,
            "type": "MoveTo",
            "version": 1
        }

        if (pov_coordinate !== undefined && pov_offset != undefined) {
            waypoint.pov_coordinate = [
                pov_coordinate.lat,
                pov_coordinate.lon,
                pov_coordinate.alt,
            ]
            waypoint.pov_elevation = pov_offset
        }

        return waypoint
    }

    function js_parseWaypoint(action) {
        var waypoint = {
            lat: action["coordinate"][0],
            lon: action["coordinate"][1],
            alt: action["coordinate"][2],
            delay: action["delay"],
            offset: action["elevation"],
            heading: action["heading"],
            speed: action["speed"],
            command: action["command"],
        }

        if (action["pov_coordinate"] && action["pov_elevation"]) {
            waypoint.pov = {
                lat: action["pov_coordinate"][0],
                lon: action["pov_coordinate"][1],
                alt: action["pov_coordinate"][2],
                offset: action["pov_elevation"]
            }
        }

        return waypoint
    }

    function js_parseMission(string) {
        var object = JSON.parse(string)

        var actions = object["actions"].map(function (action) {
            return js_parseWaypoint(action)
        })

        return {
            actions: actions,
            home_position: {
                lat: object["home"]["coordinate"][0],
                lon: object["home"]["coordinate"][1],
            },
            home_address: object["name"],
            defaults: {
                defaultAltitude: object["defaultAltitude"],
                defaultDelay: object["defaultDelay"],
                defaultDistance: object["defaultDistance"],
                defaultHeading: object["defaultHeading"],
                defaultOverlap: object["defaultOverlap"],
                defaultRadius: object["defaultRadius"],
                defaultSpeed: object["defaultSpeed"],
                defaultWidth: object["defaultWidth"],
            }
        }
    }


    return __cesium_mod_mission = {
        map_hasPoint: map_hasPoint,
        map_addPoint: map_addPoint,
        map_removePoint: map_removePoint,
        map_getPointLabel: map_getPointLabel,
        map_getPointOffset: map_getPointOffset,
        map_setPointOffset: map_setPointOffset,
        map_getPointSpeed: map_getPointSpeed,
        map_setPointSpeed: map_setPointSpeed,
        map_setPointDelay: map_setPointDelay,
        map_setPointHeading: map_setPointHeading,
        map_setPointCommand: map_setPointCommand,

        map_addPOVPoint: map_addPOVPoint,
        map_removePOVPoint: map_removePOVPoint,
        map_hasPOVPoint: map_hasPOVPoint,
        map_hasPOVGroundPoint: map_hasPOVGroundPoint,
        map_setPOVPointOffset: map_setPOVPointOffset,
        map_getPOVPointOffset: map_getPOVPointOffset,
        map_setPOVGroundPointPositions: map_setPOVGroundPointPositions,
        map_getAddPOVMode: map_getAddPOVMode,
        map_setAddPOVMode: map_setAddPOVMode,

        map_addHomePoint: map_addHomePoint,
        map_removeHomePoint: map_removeHomePoint,
        map_hasHomePoint: map_hasHomePoint,
        map_setHomePointPosition: map_setHomePointPosition,
        map_getHomePointAddress: map_getHomePointAddress,
        map_getHomePointWeather: map_getHomePointWeather,

        map_hasGroundPoint: map_hasGroundPoint,
        map_setGroundPointPositions: map_setGroundPointPositions,

        map_takeScreenshot: map_takeScreenshot,
        map_getDistanceAndDuration: map_getDistanceAndDuration,
        map_setCurrentIndex: map_setCurrentIndex,

        js_createMission: js_createMission,
        js_parseMission: js_parseMission,

        map_destroy: map_destroy,
    }
}