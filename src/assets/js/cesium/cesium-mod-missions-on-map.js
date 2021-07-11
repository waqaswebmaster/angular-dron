var __cesium_mod_missions_on_map = null

// for lazy access
function get_cesium_mod_missions_on_map() {
    return __cesium_mod_missions_on_map || {}
}

// for initial access
function init_cesium_mod_missions_on_map(viewer, colors) {
    if (__cesium_mod_missions_on_map) return __cesium_mod_missions_on_map

    var missionsEntityIds = []

    function setMission(mission_id, mission_actions, home_position, mission_name) {
        let entity_id = "missions_on_map_" + mission_id
        let entity = viewer.entities.getById(entity_id)

        let length = missionsEntityIds.length
        let color = length < colors.length ? colors[length] : colors[colors.length]

        if (!entity) {
            missionsEntityIds.push(entity_id)
            missionsEntityIds.push(entity_id + "_label")

            viewer.entities.add(getPolyline(entity_id, mission_actions, color))
            viewer.entities.add(getLabel(entity_id + "_label", home_position, mission_name))
        }
    }

    // MultiLineString, LineString
    function getPolylinePosition(actions) {
        var lineStringPointsFlat = [] // Array of Point flat

        actions.forEach(function (action) {
            lineStringPointsFlat.push(action.lon)
            lineStringPointsFlat.push(action.lat)
        })

        return Cesium.Cartesian3.fromDegreesArray(lineStringPointsFlat)
    }

    function getPolyline(id, actions, color) {
        var solidColor = getRGBAColor(color, 1)
        var outlineColor = getRGBAColor(color, 0.6)

        return {
            id: id,
            name: id,
            polyline: {
                positions: getPolylinePosition(actions),
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: solidColor,
                    outlineWidth: 2,
                    outlineColor: outlineColor,
                }),
                width: 6,
                clampToGround: true,
            },
        }
    }

    function getLabel(id, home_position, mission_name) {
        return {
            id: id,
            name: id,
            position: Cesium.Cartesian3.fromDegrees(home_position['lon'], home_position['lat'],),
            label: {
                text: mission_name,
                font: "10px",
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },

        }
    }

    function getRGBAColor(cssValue, alphaString) {
        var color = Cesium.Color.fromCssColorString(cssValue)
        color = Cesium.Color.fromAlpha(color, Number(alphaString))
        return color
    }

    // Visibility
    function toggleVisibility(isVisible) {
        missionsEntityIds.forEach(function (id) {
            viewer.entities.getById(id).show = isVisible
        })
    }

    // Mod definition
    return __cesium_mod_missions_on_map = {
        toggleVisibility,
        setMission,
    }
}