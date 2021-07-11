var __cesium_mod_drone = null

// for lazy access
function get_cesium_mod_drone() {
    return __cesium_mod_drone || {}
}

// for initial access
function init_cesium_mod_drone(viewer, dom_selectDrone) {
    if (__cesium_mod_drone) return __cesium_mod_drone

    var map_drones_entities = {}
    var map_drones_positions = {}
    var map_drones_orientation = {}
    var map_drones_fov_entities = {}
    var map_drones_home_positions = {}

    var map_orbit = undefined
    var fly_around_interval
    var is_first_drone_zoom = false

    function map_fovToggleVisibility() {
        var keys = Object.keys(map_drones_fov_entities)
        keys.forEach(function (key) {
            map_drones_fov_entities[key].show = !map_drones_fov_entities[key].show
        })
    }

    function map_addDrone(drone_id, drone_name, color) {
        if (!map_drones_entities["drone-" + drone_id]) {
            console.log('map_addDrone', drone_id)
            let count = Object.keys(map_drones_entities).length

            map_drones_positions[drone_id] = null
            map_drones_orientation[drone_id] = null
            map_drones_home_positions[drone_id] = null

            origin = Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 200000.0);
            var drone = viewer.entities.add({
                name: "drone-" + drone_id,
                position: new Cesium.CallbackProperty(function () {
                    if (map_drones_positions[drone_id]) {
                        var lon = map_drones_positions[drone_id].lon
                        var lat = map_drones_positions[drone_id].lat
                        var alt = map_drones_positions[drone_id].alt

                        var globeHeight = utils_getGlobeHeight(lon, lat)
                        if (globeHeight && globeHeight > 0) {
                            if (globeHeight > alt) {
                                alt = globeHeight + 2.0
                            }
                        }

                        if (is_first_drone_zoom == false) {
                            map_selectDrone(drone_id, 1.0)
                            dom_selectDrone(drone_id)
                            is_first_drone_zoom = true
                        }

                        return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                    }
                }),
                orientation: new Cesium.CallbackProperty(function () {
                    if (map_drones_orientation[drone_id] && map_drones_positions[drone_id]) {
                        var lon = map_drones_positions[drone_id].lon
                        var lat = map_drones_positions[drone_id].lat
                        var alt = map_drones_positions[drone_id].alt

                        var heading = map_drones_orientation[drone_id].heading
                        var pitch = map_drones_orientation[drone_id].pitch
                        var roll = map_drones_orientation[drone_id].roll

                        var position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

                        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

                        return Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
                    }
                }),
                model: {
                    uri: DRONE_MODEL_URL,
                    scale: 0.005,
                },
                label: {
                    show: true,
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromCssColorString(color),
                    font: "14px",
                    text: drone_name,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(5, 5),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                viewFrom: new Cesium.Cartesian3(0, 0, 250)
            });


            var drone_fov = viewer.entities.add({
                name: "fov-" + drone_id,
                position: new Cesium.CallbackProperty(function () {
                    if (map_drones_positions[drone_id]) {
                        var lon = map_drones_positions[drone_id].lon
                        var lat = map_drones_positions[drone_id].lat
                        var alt = map_drones_positions[drone_id].alt

                        var globeHeight = utils_getGlobeHeight(lon, lat)
                        if (globeHeight && globeHeight > 0) {
                            if (globeHeight > alt) {
                                alt = globeHeight + 2.0
                            }
                        }

                        if (is_first_drone_zoom == false) {
                            map_selectDrone(drone_id, 1.0)
                            dom_selectDrone(drone_id)
                            is_first_drone_zoom = true
                        }

                        return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                    }
                }),
                orientation: new Cesium.CallbackProperty(function () {
                    if (map_drones_orientation[drone_id] && map_drones_positions[drone_id]) {
                        var lon = map_drones_positions[drone_id].lon
                        var lat = map_drones_positions[drone_id].lat
                        var alt = map_drones_positions[drone_id].alt

                        var heading = map_drones_orientation[drone_id].heading
                        var pitch = map_drones_orientation[drone_id].pitch
                        var roll = map_drones_orientation[drone_id].roll

                        var position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

                        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

                        return Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
                    }
                }),
                model: {
                    uri: DRONE_FOVMODEL_URL,
                    scale: 0.2,
                    color: Cesium.Color.fromAlpha(Cesium.Color.BLUE, 0.2),
                    colorBlendMode: Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT,
                    colorBlendAmount: 1,
                    silhouetteColor: Cesium.Color.fromAlpha(Cesium.Color.BLUE, 0.5),
                    silhouetteSize: 2.0,
                },
                viewFrom: new Cesium.Cartesian3(0, 0, 250)
            });

            map_drones_fov_entities["fov-" + drone_id] = drone_fov
            map_drones_entities["drone-" + drone_id] = drone

            return drone
        }
    }

    function map_removeDrone(drone_id) {
        dom_selectDrone(undefined)

        if (viewer.trackedEntity === map_drones_entities["drone-" + drone_id]) {
            viewer.trackedEntity = undefined
        }

        if (viewer.selectedEntity === map_drones_entities["drone-" + drone_id]) {
            viewer.selectedEntity = undefined
        }

        viewer.entities.remove(map_drones_entities["drone-" + drone_id])
        viewer.entities.remove(map_drones_positions["drone-" + drone_id])
        viewer.entities.remove(map_drones_orientation["drone-" + drone_id])
        viewer.entities.remove(map_drones_fov_entities["fov-" + drone_id])
        viewer.entities.remove(map_drones_home_positions["drone-" + drone_id])

        delete map_drones_entities["drone-" + drone_id]
        delete map_drones_positions["drone-" + drone_id]
        delete map_drones_orientation["drone-" + drone_id]
        delete map_drones_fov_entities["fov-" + drone_id]
        delete map_drones_home_positions["drone-" + drone_id]
    }

    function map_updateDronePosition(drone_id, position) {
        map_drones_positions[drone_id] = position
    }

    function map_getDronePosition(drone_id) {
        return map_drones_positions[drone_id]
    }

    function map_updateDroneOrientation(drone_id, orientation) {
        map_drones_orientation[drone_id] = orientation
    }

    function map_updateDroneHomePosition(drone_id, home_position) {
        map_drones_home_positions[drone_id] = home_position
    }

    function map_getDroneHomeAltitude(drone_id) {
        if (map_drones_home_positions[drone_id]) {
            return map_drones_home_positions[drone_id].alt
        }
        return 0
    }

    function map_calculateHomeDistance(drone_id) {
        if (map_drones_home_positions[drone_id] == null) return 0

        var geodesic = new Cesium.EllipsoidGeodesic();

        var startCartographic = Cesium.Cartographic.fromDegrees(map_drones_positions[drone_id].lon, map_drones_positions[drone_id].lat, map_drones_positions[drone_id].alt);
        var endCartographic = Cesium.Cartographic.fromDegrees(map_drones_home_positions[drone_id].lon, map_drones_home_positions[drone_id].lat, map_drones_home_positions[drone_id].alt);

        geodesic.setEndPoints(startCartographic, endCartographic);

        return ((geodesic.surfaceDistance).toFixed(0))
    }

    function map_flyToDrone(drone_id, height, duration) {
        if (drone_id) {
            if (map_drones_entities["drone-" + drone_id]) {
                return viewer.flyTo(map_drones_entities["drone-" + drone_id], {
                    offset: new Cesium.HeadingPitchRange(0.0, -1.2, height ? height : 500.0),
                    duration: duration ? duration : 3.0,
                })
            }
        } else {
            return viewer.flyTo(false)
        }
    }

    function map_trackDrone(drone_id, fly_around) {
        if (drone_id) {
            if (map_drones_entities["drone-" + drone_id]) {
                map_flyToDrone(drone_id, 250.0, 1.2).then(function () {
                    viewer.trackedEntity = map_drones_entities["drone-" + drone_id]

                    if (fly_around) {
                        setTimeout(function () {
                            viewer.camera.rotateUp(1.2)
                        }, 100)

                        fly_around_interval = setInterval(function () {
                            viewer.camera.rotateLeft(0.0025)
                        }, 25)
                    } else {
                        clearInterval(fly_around_interval)
                    }
                })
            } else {
                clearInterval(fly_around_interval)
                viewer.trackedEntity = undefined
            }
        } else {
            clearInterval(fly_around_interval)
            viewer.trackedEntity = undefined
        }
    }

    function map_selectDrone(drone_id, duration) {
        if (drone_id) {
            if (map_drones_entities["drone-" + drone_id]) {
                map_flyToDrone(drone_id, 250.0, duration ? duration : 0.5).then(function () {
                    viewer.selectedEntity = map_drones_entities["drone-" + drone_id]
                })
            } else {
                viewer.selectedEntity = undefined
            }
        } else {
            viewer.selectedEntity = undefined
        }
    }

    function map_drawCircle(lon, lat, alt, height, radius) {
        map_dropCircle()

        map_orbit = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
            name: "orbit",
            ellipse: {
                semiMinorAxis: radius,
                semiMajorAxis: radius,
                height: height,
                material: Cesium.Color.GREEN.withAlpha(0),
                outline: true, // height must be set for outline to display
                outlineColor: Cesium.Color.YELLOW,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        })
    }

    function map_dropCircle() {
        if (map_orbit) {
            viewer.entities.remove(map_orbit)
            map_orbit = undefined
        }
    }

    return __cesium_mod_drone = {
        map_addDrone: map_addDrone,
        map_removeDrone: map_removeDrone,
        map_getDronePosition: map_getDronePosition,
        map_updateDronePosition: map_updateDronePosition,
        map_updateDroneHomePosition: map_updateDroneHomePosition,
        map_updateDroneOrientation: map_updateDroneOrientation,
        map_calculateHomeDistance: map_calculateHomeDistance,
        map_getDroneHomeAltitude: map_getDroneHomeAltitude,
        map_flyToDrone: map_flyToDrone,
        map_selectDrone: map_selectDrone,
        map_trackDrone: map_trackDrone,

        map_drawCircle: map_drawCircle,
        map_dropCircle: map_dropCircle,

        map_fovToggleVisibility: map_fovToggleVisibility,
    }
}