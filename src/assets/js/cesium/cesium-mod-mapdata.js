var __cesium_mod_mapdata = null

// for lazy access
function get_cesium_mod_mapdata() {
    return __cesium_mod_mapdata || {}
}

// for initial access
function init_cesium_mod_mapdata(viewer) {
    if (__cesium_mod_mapdata) return __cesium_mod_mapdata

    var new_allEntityIDs = []
    var old_allEntityIDs = []

    var airspaceEntityIds = []
    var groundHazardEntityIds = []

    function getRGBAColor(cssValue, alphaString) {
        var color = Cesium.Color.fromCssColorString(cssValue)
        color = Cesium.Color.fromAlpha(color, Number(alphaString))
        return color
    }

    function caseMulti(collection, feature, callback) {
        var properties = feature.properties
        var coordinates = feature.geometry.coordinates

        coordinates.forEach(function (coordinates, index) {
            var id = "mapdata_" + feature.id + "__" + index

            addEntity(collection, id, properties, coordinates, callback)
        })
    }

    function caseSingle(collection, feature, callback) {
        var id = "mapdata_" + feature.id
        var properties = feature.properties
        var coordinates = feature.geometry.coordinates

        addEntity(collection, id, properties, coordinates, callback)
    }

    function addEntity(collection, id, properties, coordinates, callback) {
        var entity = viewer.entities.getById(id)
        if (!entity) {
            collection.add(callback(id, properties, coordinates))
        }
        new_allEntityIDs.push(id)
    }

    // MultiPolygon, Polygon
    function getPolygonHierarchy(coordinates) {
        var polygonPointsFlat = [] // Array of Point flat
        var polygonHolesFlatArr = [] // Array of Holes flat arrays

        coordinates.forEach(function (coordinates, index) {
            if (index === 0) { // polygonPoints
                coordinates.forEach(function (coord) {
                    polygonPointsFlat.push(coord[0])
                    polygonPointsFlat.push(coord[1])
                    polygonPointsFlat.push(utils_correctAlt(coord[0], coord[1], 0.0, 150.0)) // height
                })
            } else {
                var polygonHolesFlat = []
                coordinates.forEach(function (coord) {
                    polygonHolesFlat.push(coord[0])
                    polygonHolesFlat.push(coord[1])
                    polygonHolesFlat.push(utils_correctAlt(coord[0], coord[1], 0.0, 150.0)) // height
                })

                polygonHolesFlatArr.push(polygonHolesFlat)
            }
        })

        var positions = Cesium.Cartesian3.fromDegreesArrayHeights(polygonPointsFlat)
        var holes = polygonHolesFlatArr.map(function (hole) {
            return {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(hole)
            }
        })

        return new Cesium.PolygonHierarchy(positions, holes)
    }

    function getPolygon(id, properties, coordinates) {
        var solidColor = getRGBAColor(properties.fillColor, properties.fillOpacity)
        var outlineColor = getRGBAColor(properties.strokeColor, properties.strokeOpacity)

        var description = {
            display: properties.display,
            fillColor: properties.fillColor,
            fillOpacity: properties.fillOpacity,
            strokeColor: properties.strokeColor,
            strokeOpacity: properties.strokeOpacity,
            id: id,
        }

        return {
            id: id,
            name: id,
            description: description,
            polygon: {
                hierarchy: getPolygonHierarchy(coordinates),
                material: solidColor,
                extrudedHeight: 0,
                perPositionHeight: true,
                outline: true,
                outlineColor: outlineColor,
                outlineWidth: properties.strokeWidth ? Number(properties.strokeWidth) : 1,
            },
        }
    }

    // MultiPoint, Point
    function getPointPosition(coordinates) {
        return Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1])
    }

    function getPoint(id, properties, coordinates) {
        var description = {
            display: properties.display,
            fillColor: properties.fillColor,
            fillOpacity: properties.fillOpacity,
            strokeColor: properties.strokeColor,
            strokeOpacity: properties.strokeOpacity,
            id: id,
        }

        return {
            id: id,
            name: id,
            description: description,
            position: getPointPosition(coordinates),
            billboard: {
                image: properties.iconUrl,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        }
    }

    // MultiLineString, LineString
    function getPolylinePosition(coordinates) {
        var lineStringPointsFlat = [] // Array of Point flat

        coordinates.forEach(function (coord) {
            lineStringPointsFlat.push(coord[0])
            lineStringPointsFlat.push(coord[1])
        })

        return Cesium.Cartesian3.fromDegreesArray(lineStringPointsFlat)
    }

    function getPolyline(id, properties, coordinates) {
        var solidColor = getRGBAColor(properties.fillColor, properties.fillOpacity)
        var outlineColor = getRGBAColor(properties.strokeColor, properties.strokeOpacity)

        var description = {
            display: properties.display,
            fillColor: properties.fillColor,
            fillOpacity: properties.fillOpacity,
            strokeColor: properties.strokeColor,
            strokeOpacity: properties.strokeOpacity,
            id: id,
        }

        return {
            id: id,
            name: id,
            description: description,
            polyline: {
                positions: getPolylinePosition(coordinates),
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: solidColor,
                    outlineWidth: properties.strokeWidth ? Number(properties.strokeWidth) : 1,
                    outlineColor: outlineColor,
                }),
                width: 3,
                clampToGround: true,
            },
        }
    }

    function fillCollection(collection, features) {
        features.forEach(function (feature) {
            switch (feature.geometry.type) {
                case "Polygon":
                    caseSingle(collection, feature, getPolygon)
                    break
                case "MultiPolygon":
                    caseMulti(collection, feature, getPolygon)
                    break
                case "Point":
                    caseSingle(collection, feature, getPoint)
                    break
                case "MultiPoint":
                    caseMulti(collection, feature, getPoint)
                    break
                case "LineString":
                    caseSingle(collection, feature, getPolyline)
                    break
                case "MultiLineString":
                    caseMulti(collection, feature, getPolyline)
                    break
                default:
                    break
            }
        })
    }

    function initOldest() {
        old_allEntityIDs = new_allEntityIDs.map(id => id)
        new_allEntityIDs = []
    }

    function cleanOldest() {
        var toRemoveIds = []
        old_allEntityIDs.forEach(function (id) {
            if (new_allEntityIDs.indexOf(id) === -1) {
                toRemoveIds.push(id)
                viewer.entities.removeById(id)
            }
        })

        return toRemoveIds
    }

    function setFeatures(features) {
        var airspace = []
        var groundHazard = []

        groundHazardEntityIds = []
        airspaceEntityIds = []

        features.forEach(function (feature) {
            if (feature.properties && feature.properties.filters) {
                var isGroundHazards = feature.properties.filters.find(function (filter) {
                    return filter.name == "Ground Hazards"
                })

                var isUpperAirspace = feature.properties.filters.find(function (filter) {
                    return filter.name == "Upper Airspace"
                })

                if (isGroundHazards) {
                    groundHazardEntityIds.push("mapdata_" + feature.id)
                    groundHazard.push(feature)
                } else if (!isUpperAirspace) {
                    airspaceEntityIds.push("mapdata_" + feature.id)
                    airspace.push(feature)
                }
            }
        })

        initOldest()
        if (airspace.length > 0) {
            fillCollection(viewer.entities, airspace)
        }
        if (groundHazard.length > 0) {
            fillCollection(viewer.entities, groundHazard)
        }
        return cleanOldest()
    }

    // Visibility
    function toggleAirspaceVisibility(isVisible) {
        airspaceEntityIds.forEach(function (id) {
            if (viewer.entities.getById(id))
                viewer.entities.getById(id).show = isVisible
        })
    }

    function toggleGroundHazardVisibility(isVisible) {
        groundHazardEntityIds.forEach(function (id) {
            if (viewer.entities.getById(id))
                viewer.entities.getById(id).show = isVisible
        })
    }

    // Selected
    function setSelected(ids) {
        ids.forEach(function (id) {
            new_allEntityIDs.forEach(function (a_id) {
                if (id === a_id) {
                    var entity = viewer.entities.getById(id)
                    if (entity && entity.polygon) {
                        entity.polygon.outlineColor = Cesium.Color.WHITE;
                    }
                }
            })
        })
    }

    function setUnselected(ids) {
        ids.forEach(function (id) {
            new_allEntityIDs.forEach(function (a_id) {
                if (id === a_id) {
                    var entity = viewer.entities.getById(id)
                    if (entity && entity.polygon) {
                        var descr = entity.description.getValue()
                        var color = Cesium.Color.fromRgba(getRGBAColor(descr.strokeColor, descr.strokeOpacity))
                        entity.polygon.outlineColor = color;
                    }
                }
            })
        })
    }

    // Mod definition
    return __cesium_mod_mapdata = {
        setFeatures: setFeatures,
        setSelected: setSelected,
        setUnselected: setUnselected,
        toggleAirspaceVisibility,
        toggleGroundHazardVisibility,
    }
}