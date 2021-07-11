(function () {
    const FLIGHTPLAN_OFFSET = 130
    const FLIGHTPLAN_RADIUS = 100
    const POV_OFFSET = 5
    const INIT_OFFSET = 50
    const INIT_SPEED = 5
    const ORBIT_RADIUS = 20

    var $mapdataIndicatorLoading = $('.mapdata-indicator__loading')
    var $mapdataIndicatorInfo = $('.mapdata-indicator__info')
    var $mapdataContextInfo = $('.mapdata-context-info')
    var $mapdataContextInfoContent = $('.mapdata-context-info .content')

    var $selectMissionBtn = $('.select-mission');
    var $selectMissionModal = $('#selectMissionModal')
    var $missionForm = $('.mission-form')

    var $drones = $('.drones');
    var $alertAddPoint = $('.add-point-alert');

    var $contextMenu = $('.context-menu')

    var dragging_point_home;
    var dragging_point_ground;
    var dragging_point;
    var dragging_flightplan;

    var flightplan_interval = undefined
    var flightplan_data = undefined
    var flightplan_open = false
    var flightplan_add_mode = false

    var mission_current = undefined

    var mapdata_selected_ids = []

    var colors = get_colors()
    var saveDisabled = false

    // Create viewer
    var viewer = cesium_create_viewer('cesiumContainer')

    // Create handler
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Init dom mod mission
    var dom_mod_mission = init_dom_mod_mission(true, true)

    // Init cesium mod mission
    var cesium_mod_mission = init_cesium_mod_mission(viewer, dom_mod_mission, INIT_OFFSET, INIT_SPEED, POV_OFFSET)

    // Init cesium mod mapdata
    var cesium_mod_mapdata = init_cesium_mod_mapdata(viewer)

    // Init cesium mod flightplan
    var cesium_mod_flightplan = init_cesium_mod_flightplan(viewer, FLIGHTPLAN_OFFSET)

    // Init cesium modules
    var cesium_mod_drone = init_cesium_mod_drone(viewer, dom_selectDrone)

    // Init cesium modules missions_on_map
    var cesium_mode_missions_on_map = init_cesium_mod_missions_on_map(viewer, colors)

    // Add handler to stop follow
    // handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.WHEEL)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.PINCH_START)

    // Select entity
    handler.setInputAction(function (movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (flightplan_add_mode === false) {
            if (flightplan_open === false) {
                $mapdataContextInfo.hide()
            }

            cesium_mod_mapdata.setUnselected(mapdata_selected_ids)
            if (Cesium.defined(pickedObject)) {
                var picketObjectName = pickedObject.id.name + ""

                if (picketObjectName.startsWith("missions_on_map_")) {
                    var mission_id = picketObjectName.replace(/\D/g, "");

                    $('.mission-preview[data-id="' + mission_id + '"]').click()
                } else if (picketObjectName.startsWith("flightplan")) {

                } else if (picketObjectName.startsWith("mapdata_")) {
                    mapdata_selected_ids = []

                    // Get picket items
                    var picketObjects = viewer.scene.drillPick(movement.position);

                    // Collect display data
                    var displayItems = picketObjects.map(function (x) {
                        return x.id.description.getValue()
                    })

                    // Generate markup and populate mapdata_selected_ids
                    var info = ""
                    displayItems.forEach(function (item) {
                        var fillColor = item.fillColor
                        var display = item.display
                        var id = item.id

                        mapdata_selected_ids.push(id)

                        var details = display.sections.map(function (section) {
                            return "" +
                                "<div class='item'>" +
                                "<div class='title'>" + section.title + "</div>" +
                                "<div class='info'>" + section.text + "</div>" +
                                "</div>"
                        }).join("")

                        info +=
                            "<div data-mapdata-id='" + id + "'>" +
                            "<div class='top'>" +
                            "<div class='color' style='background-color: " + fillColor + "'> " + "</div>" +
                            "<div class='title'>" + (display.detailedCategory || display.title) + "</div>" +
                            "</div>" + details + "</div>"
                    })

                    $mapdataContextInfoContent.html(info)
                    $mapdataContextInfoContent.scrollTop(0)
                    $mapdataContextInfo.show()

                    // Mark selected
                    cesium_mod_mapdata.setSelected(mapdata_selected_ids)
                } else if (picketObjectName.includes("drone")) {
                    // Select drone (click by drone+sysid) ------
                    var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");

                    cesium_mod_drone.map_selectDrone(link_uuid)
                    dom_selectDrone(link_uuid)

                } else if (picketObjectName === "home") {
                    // Select home (click bt home)

                    cesium_mod_mission.map_setCurrentIndex("home")
                } else {
                    // Select point (click by ground+point_index or point_index)

                    var point_index = picketObjectName.replace(/\D/g, "");
                    cesium_mod_mission.map_setCurrentIndex(point_index)
                }
            } else {
                if (cesium_mod_mission.map_getAddPOVMode() === false) {
                    cesium_mod_mission.map_setCurrentIndex(null)
                }
            }
        }

        $contextMenu.hide()
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // Drag start
    handler.setInputAction(function (movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
            var picketObjectName = pickedObject.id.name + ""

            if (picketObjectName.includes("flightplan_center")) {
                dragging_flightplan = pickedObject;

                viewer.scene.screenSpaceCameraController.enableRotate = false;
            }

            if (picketObjectName.includes("home") && cesium_mod_mission.map_hasHomePoint()) {
                dragging_point_home = pickedObject;

                viewer.scene.screenSpaceCameraController.enableRotate = false;
            }

            if (picketObjectName.includes("ground") && cesium_mod_mission.map_hasGroundPoint(picketObjectName)) {
                dragging_point_ground = pickedObject;

                viewer.scene.screenSpaceCameraController.enableRotate = false;
            }

            if (picketObjectName.includes("pov_ground") && cesium_mod_mission.map_hasPOVGroundPoint(picketObjectName)) {
                dragging_point_ground = pickedObject;

                viewer.scene.screenSpaceCameraController.enableRotate = false;
            }

            if (picketObjectName.includes("pov")) {
                if (cesium_mod_mission.map_hasPOVPoint(picketObjectName)) {
                    dragging_point = pickedObject;

                    viewer.scene.screenSpaceCameraController.enableRotate = false;
                }
            } else {
                if (cesium_mod_mission.map_hasPoint(picketObjectName)) {
                    dragging_point = pickedObject;

                    viewer.scene.screenSpaceCameraController.enableRotate = false;
                }
            }
        }

        drone_stopFollow()
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // Drag end
    handler.setInputAction(function (movement) {
        if (Cesium.defined(dragging_flightplan)) {
            dragging_flightplan = undefined;

            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }

        if (Cesium.defined(dragging_point_home)) {
            dragging_point_home = undefined;

            cesium_mod_mission.map_getHomePointAddress(true)

            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }

        if (Cesium.defined(dragging_point_ground)) {
            dragging_point_ground = undefined;

            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }

        if (Cesium.defined(dragging_point)) {
            dragging_point = undefined;

            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // Drag move
    handler.setInputAction(function (movement) {
        if (Cesium.defined(dragging_flightplan)) {
            var cartesian = utils_getCartesianFromMovement(movement.endPosition)
            cesium_mod_flightplan.map_changePosition(cartesian)
            var {lon, lat} = cesium_mod_flightplan.getCenterPosition()
            dom_setLocLonLat(lon, lat)
        }

        if (Cesium.defined(dragging_point_home)) {
            var cartesian = utils_getCartesianFromMovement(movement.endPosition)

            if (cartesian) {
                var {lon, lat} = utils_getLonLatAltFromCartesian(cartesian)

                cesium_mod_mission.map_setHomePointPosition(lon, lat)
            }
        }

        if (Cesium.defined(dragging_point_ground)) {
            var picketObjectName = dragging_point_ground.id.name + ""

            var cartesian = utils_getCartesianFromMovement(movement.endPosition)

            if (cartesian) {
                var {lon, lat} = utils_getLonLatAltFromCartesian(cartesian)

                if (picketObjectName.includes("pov")) {
                    cesium_mod_mission.map_setPOVGroundPointPositions(picketObjectName, lon, lat, true)
                } else {
                    cesium_mod_mission.map_setGroundPointPositions(picketObjectName, lon, lat, true)
                }
            }
        }

        if (Cesium.defined(dragging_point)) {
            var picketObjectName = dragging_point.id.name + ""

            var offsetY = movement.startPosition.y - movement.endPosition.y
            var offset

            if (picketObjectName.includes("pov")) {
                offset = cesium_mod_mission.map_getPOVPointOffset(picketObjectName)
            } else {
                offset = cesium_mod_mission.map_getPointOffset(picketObjectName)
            }

            offset += offset < 100
                ? offset < 50
                    ? offsetY / 3
                    : offsetY / 2
                : offsetY

            if (picketObjectName.includes("pov")) {
                cesium_mod_mission.map_setPOVPointOffset(picketObjectName, offset, true)
            } else {
                cesium_mod_mission.map_setPointOffset(picketObjectName, offset, true)
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Add handler to add/remove entity or drone to reposition
    handler.setInputAction(function (movement) {
        if (flightplan_add_mode) {
            var cartesian = utils_getCartesianFromMovement(movement.position)
            handler_setFlightPlan(cartesian, FLIGHTPLAN_RADIUS)
        } else if ($alertAddPoint.css('display') === "none") {
            handler_doRepositionOrSelectDrone(movement)
        } else {
            handler_addOrRemoveMissionEntities(movement)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // Right-click menu
    handler.setInputAction(function (movement) {
        if ($(".drone-block.active").length > 0 && viewer.selectedEntity) {
            $contextMenu.show()
            $contextMenu.css('top', movement.position.y + "px")
            $contextMenu.css('left', movement.position.x + "px")

            var cartesian = utils_getCartesianFromMovement(movement.position)

            if (cartesian) {
                var {lon, lat, alt} = utils_getLonLatAltFromCartesian(cartesian)

                var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");
                var drone_alt = cesium_mod_drone.map_getDronePosition(link_uuid).alt

                // alt - ground alt
                // drone_alt - drone alt
                var elevation = drone_alt > alt ? drone_alt : alt

                if (link_uuid && lat && lon && alt) {
                    $contextMenu.on("click", ".context-orbit", function (e) {
                        $contextMenu.hide()

                        var sysid = $(".drone-block.active").attr('data-id')
                        cesium_mod_drone.map_drawCircle(lon, lat, alt, elevation, ORBIT_RADIUS)
                        get_mavlink_mod_commands(link_uuid).mav_send_DO_ORBIT(sysid, lat, lon, elevation, ORBIT_RADIUS)

                        $contextMenu.off("click", ".btn-primary")
                    })
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // Load map data
    viewer.camera.moveEnd.addEventListener(function () {
        if (mapdata_isAllUnchecked() == false) { // All unchecked also if feature_mapdata_is_active == False, by logic
            mapdata_getData()
        } else {
            $mapdataIndicatorInfo.hide()
        }
    });

    function map_renderMissionsOnMap() {
        let $missionJSONList = $('[type="application/json"]')

        $missionJSONList.each((index, el) => {
            let $el = $(el)
            let missionId = $el.prop("id")

            if (missionId.startsWith("mission-data-")) {
                missionId = Number(missionId.replace("mission-data-", ""))

                let missionJSON = $el.text()
                if (missionJSON && missionJSON != "\"\"" && missionJSON != "{}") {
                    let mission = cesium_mod_mission.js_parseMission(missionJSON)
                    let mission_name = get_mission_name_by_id(missionId)

                    cesium_mode_missions_on_map.setMission(missionId, mission.actions, mission.home_position, mission_name)
                }
            }
        })
    }

    function mapdata_restoreVisibility() {
        var isAirspaceChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Airspace"]').length > 0
        var isGroundHazardsChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Ground Hazards"]').length > 0

        cesium_mod_mapdata.toggleAirspaceVisibility(isAirspaceChecked)
        cesium_mod_mapdata.toggleGroundHazardVisibility(isGroundHazardsChecked)
    }

    function mapdata_saveToLocalStorage() {
        var isAirspaceChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Airspace"]').length > 0
        var isGroundHazardsChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Ground Hazards"]').length > 0

        localStorage.setItem('isAirspaceChecked', isAirspaceChecked + '');
        localStorage.setItem('isGroundHazardsChecked', isGroundHazardsChecked + '');
    }

    function mapdata_loadFromLocalStorage() {
        var isAirspaceCheckedValue = localStorage.getItem('isAirspaceChecked')
        var isGroundHazardsCheckedValue = localStorage.getItem('isGroundHazardsChecked')

        if (isAirspaceCheckedValue !== null) {
            $('.mapdata-selector .map-data-items .item[data-item="Airspace"]').toggleClass("checked", isAirspaceCheckedValue === 'true');
        }

        if (isGroundHazardsCheckedValue !== null) {
            $('.mapdata-selector .map-data-items .item[data-item="Ground Hazards"]').toggleClass("checked", isGroundHazardsCheckedValue === 'true');
        }
    }

    function mapdata_isAllUnchecked() {
        var allUnchecked = false

        var isAirspaceChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Airspace"]').length > 0
        var isGroundHazardsChecked = $('.mapdata-selector .map-data-items .item.checked[data-item="Ground Hazards"]').length > 0

        if (!isAirspaceChecked && !isGroundHazardsChecked) {
            allUnchecked = true
        }

        return allUnchecked
    }

    function mapdata_getData() {
        var height = viewer.camera.positionCartographic.height
        var viewRectRad = viewer.camera.computeViewRectangle()
        var vewRectDeg = {
            w: Cesium.Math.toDegrees(viewRectRad.west),
            s: Cesium.Math.toDegrees(viewRectRad.south),
            e: Cesium.Math.toDegrees(viewRectRad.east),
            n: Cesium.Math.toDegrees(viewRectRad.north),
        }

        $mapdataIndicatorLoading.show()
        $mapdataIndicatorInfo.hide()

        return $.getJSON('/api/v2/features/mapdata', vewRectDeg, function (response) {
            $mapdataIndicatorLoading.hide()

            var info = ""
            var infoItems = []
            if (response.errorType && response.errorType == "FEATURE_IS_NOT_ACTIVE") {
                info = "Altitude Angel feature is not payed <a href=\"/profile/#features\">check your subscriptions</a>"
                $(".mapdata-selector .map-data-items .item").toggleClass("checked", false).hide()
                $(".mapdata-selector .subscribe_info").show()
            } else if (response.errorReason || response.error) {
                info = "Zoom in to see: airspace, ground hazards"
            } else if (response.excludedData && response.excludedData.length > 0) {
                response.excludedData.forEach(function (data) {
                    if (data.detail.name === "Airspace") {
                        infoItems.push("airspace")
                    }

                    if (data.detail.name === "Ground Hazards") {
                        infoItems.push("ground hazards")
                    }
                })
                info = "Zoom in to see: " + infoItems.join(", ")
            }
            if (info) {
                $mapdataIndicatorInfo.html(info)
                $mapdataIndicatorInfo.show()
            }

            mapdata_toCesium(response)
        })
    }

    function mapdata_toCesium(data) {
        if (data.features) {
            var mapdata_to_remove_ids = cesium_mod_mapdata.setFeatures(data.features)
            mapdata_to_remove_ids.forEach(function (id) {
                $("div[data-mapdata-id='" + id + "']").remove()
            })

            if ($('.mapdata-context-info .content').children().length == 0) {
                $('.mapdata-context-info').hide()
            }
        }
    }

    function flightplan_getData(callback) {
        return $.getJSON('/api/v2/features/flightplan', function (response) {
            var $flightplan_items = $(".flight-plan-items")
            var list = response.list
            var html = ""

            flightplan_data = list

            $flightplan_items.html("")
            list.forEach(function (item) {
                html += '<div class="item" data-id="' + item.flight_plan_id + '">' + item.summary + '</div>'
            })
            $flightplan_items.html(html)

            if (callback) {
                callback(list)
            }
        })
    }

    function flightplan_postData(data) {
        var crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');

        var $errors = $(".flight-errors-row")
        var $submit = $(".flight-submit")

        $submit.prop("disabled", true)
        $errors.html("")
        return $.ajax({
            type: "POST",
            url: "/api/v2/features/flightplan",
            data: JSON.stringify(data),
            headers: {"X-CSRFToken": crf_token},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (response) {
                $errors.append($('<div class="col-12">Unknown error</div>'))

                $submit.prop("disabled", false)
            },
            success: function (response) {
                if (response.error) {
                    if (response.errorType === "SINGLE") {
                        $errors.append($('<div class="col-12">' + response.error + '</div>'))
                    }

                    if (response.errorType === "LIST") {
                        response.error.forEach(function (error) {
                            $errors.append($('<div class="col-12">' + error + '</div>'))
                        })
                    }
                } else if (response.flight_plan_id) {
                    flightplan_getData(function (list) {
                        var plan = list.find(p => p.flight_plan_id == response.flight_plan_id)
                        flightplan_renderDetails(plan)
                    })
                } else {
                    $errors.append($('<div class="col-12">Unknown error</div>'))
                }

                $submit.prop("disabled", false)
            },
        });
    }

    function flightPlan_endRequest(flight_plan_id) {
        var crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');

        var $errors = $(".flight-errors-row")
        var $end = $(".flight-end")

        $end.prop("disabled", true)
        $errors.html("")
        return $.ajax({
            type: "POST",
            url: "/api/v2/features/flightplan/" + flight_plan_id + "/cancel",
            headers: {"X-CSRFToken": crf_token},
            error: function (response) {
                $errors.append($('<div class="col-12">Unknown error</div>'))

                $end.prop("disabled", false)
            },
            success: function (response) {
                if (response.error) {
                    if (response.errorType === "SINGLE") {
                        $errors.append($('<div class="col-12">' + response.error + '</div>'))
                    }
                } else if (response.flight_plan_id) {
                    // TODO replace to function
                    $('.mapdata-context-info .tag').click()
                    flightplan_getData()
                } else {
                    $errors.append($('<div class="col-12">Unknown error</div>'))
                }

                $end.prop("disabled", false)
            },
        });
    }

    function flightplan_renderDetails(plan) {
        if (plan.mission) {
            var $template = flightplan_get_template_mission(plan)
            $mapdataContextInfoContent.html("")
            $template.appendTo($mapdataContextInfoContent)
            $mapdataContextInfoContent.scrollTop(0)
        } else {
            var $template = flightplan_get_template_basic(plan)
            $mapdataContextInfoContent.html("")
            $template.appendTo($mapdataContextInfoContent)
            $mapdataContextInfoContent.scrollTop(0)

            $(".flight-add-loc-row").hide()
            $(".flight-loc-row").show()
        }
    }

    function flightplan_get_datetime_info($startDT, $endDT) {
        var now = moment()
        var start = moment($startDT.val(), "DD.MM.YYYY HH:mm")
        var end = moment($endDT.val(), "DD.MM.YYYY HH:mm")

        if (start && end) {
            var isStarted = now > start
            var isEnded = now > end

            var start_minutes = moment.duration(start - now).minutes()
            var estimated_minutes = moment.duration(end - start).minutes()

            if (isEnded === false && isStarted === false) {
                return "The flight will start in " + start_minutes + " minutes and estimated flight duration will be " + estimated_minutes + " minutes"
            } else if (isEnded === false) {
                return "Estimated flight duration will be " + estimated_minutes + " minutes"
            }
        }

        return ""
    }

    function flightplan_get_template_mission(flight_plan, defaults) {
        clearInterval(flightplan_interval)

        var $flightplan_mission = $($('template.flight-plan').html())

        var $missionName = $flightplan_mission.find(".flight-mission-name")
        var $summary = $flightplan_mission.find(".flight-summary")
        var $description = $flightplan_mission.find(".flight-description")
        var $warning = $flightplan_mission.find(".flight-warning")
        var $startDT = $flightplan_mission.find(".flight-start-datetime")
        var $endDT = $flightplan_mission.find(".flight-end-datetime")
        var $infoDT = $flightplan_mission.find(".flight-datetime-info")

        var $flightSubmit = $flightplan_mission.find(".flight-submit")
        var $flightEnd = $flightplan_mission.find(".flight-end")

        $flightplan_mission.find(".flight-loc-row").remove()
        $flightplan_mission.find(".flight-loc-row-title").remove()
        $flightplan_mission.find(".flight-add-loc-row").remove()

        if (defaults) {
            $flightEnd.hide()

            var missionName = dom_mod_mission.dom_getName()
            var missionDuration = cesium_mod_mission.map_getDistanceAndDuration().duration
            var missionActions = defaults.mission.actions
            var missionLonLat = defaults.mission.home_position

            $summary.val(missionName)
            $missionName.parent().show()
            $missionName.text(missionName)
            $missionName.attr("href", get_mission_update_url(defaults.id))
            $warning.show()

            $startDT.datetimepicker({
                format: 'd.m.Y H:i',
                theme: 'dark',
                step: 5,
                onChangeDateTime: function (dp, $input) {
                    if (!$input.val()) {
                        $input.val(moment().add(10, 'm').format("DD.MM.YYYY HH:mm"))
                    }

                    var endDTValue = moment($input.val(), "DD.MM.YYYY HH:mm").add(missionDuration, 's')
                    $endDT.val(endDTValue.format("DD.MM.YYYY HH:mm"))

                    $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
                },
            })

            $startDT.val(moment().add(10, 'm').format("DD.MM.YYYY HH:mm"))
            $endDT.val(moment().add(10, 'm').add(missionDuration, 's').format("DD.MM.YYYY HH:mm"))

            $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
            flightplan_interval = setInterval(function () {
                $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
            }, 1000)

            if (missionActions && missionActions.length > 0) {
                $flightSubmit.show()
                $flightSubmit.prop("disabled", false)
                $flightSubmit.on("click", function (e) {
                    var coordinates = missionActions.map(p => [p.lon, p.lat])
                    var meters = missionActions.reduce((acc, p) => Math.max(p.alt, acc), 0);
                    var start_at = moment($startDT.val(), "DD.MM.YYYY HH:mm").utc().format()
                    var end_at = moment($endDT.val(), "DD.MM.YYYY HH:mm").utc().format()

                    var parts = [{
                        "id": "1",
                        "geography": {
                            "type": "LineString",
                            "coordinates": coordinates,
                        },
                        "start": start_at,
                        "end": end_at,
                        "maxAltitude": {
                            "datum": "wgs84",
                            "meters": meters
                        }
                    }]

                    var data = {
                        summary: $summary.val(),
                        description: $description.val(),
                        lon: Number(Number(missionLonLat.lon).toFixed(8)),
                        lat: Number(Number(missionLonLat.lat).toFixed(8)),
                        parts: parts,
                        mission_id: defaults.id,
                        start_at: start_at,
                        end_at: end_at,
                    }

                    flightplan_postData(data)
                })
            }
        } else if (flight_plan) {
            $flightSubmit.hide()
            $flightEnd.show()
            $flightEnd.on("click", function (e) {
                flightPlan_endRequest(flight_plan.flight_plan_id)
            })

            $summary.val(flight_plan.summary)
            $summary.prop('disabled', true)

            $description.val(flight_plan.description)
            $description.prop("disabled", true)

            var start_at = moment(flight_plan.start_at)
            $startDT.val(start_at.format("DD.MM.YYYY HH:mm"))
            $startDT.prop("disabled", true)

            var end_at = moment(flight_plan.end_at)
            $endDT.val(end_at.format("DD.MM.YYYY HH:mm"))
            $endDT.prop("disabled", true)

            $missionName.parent().show()
            $missionName.text(dom_mod_mission.dom_getName())
            $missionName.attr("href", get_mission_update_url(flight_plan.mission))

            var check_end_flight = function () {
                var now = moment()
                if (start_at < now) {
                    if (now > end_at) {
                        $flightEnd.hide()
                        flightplan_getData()
                    } else {
                        var diff = (end_at - now)
                        $flightEnd.html("End Flight (" + moment(diff).format('HH:mm:ss') + ")")
                        $flightEnd.show()
                    }
                } else {
                    var diff = (start_at - now)
                    $flightEnd.html("Flight start in (" + moment(diff).format('HH:mm:ss') + ")<br><small>Click to end the flight</small>")
                    $flightEnd.show()
                }
            }
            check_end_flight()
            flightplan_interval = setInterval(check_end_flight, 1000)
        }

        return $flightplan_mission
    }

    function flightplan_get_template_basic(flight_plan) {
        clearInterval(flightplan_interval)

        var $flightplan_basic = $($('template.flight-plan').html())

        var $summary = $flightplan_basic.find(".flight-summary")
        var $description = $flightplan_basic.find(".flight-description")
        var $lat = $flightplan_basic.find(".flight-lat")
        var $lon = $flightplan_basic.find(".flight-lon")
        var $startDT = $flightplan_basic.find(".flight-start-datetime")
        var $endDT = $flightplan_basic.find(".flight-end-datetime")
        var $infoDT = $flightplan_basic.find(".flight-datetime-info")

        var $radiusSlider = $flightplan_basic.find(".flight-radius")
        var $radiusHandler = $flightplan_basic.find(".flight-radius .custom-handle")

        var $addLoc = $flightplan_basic.find(".flight-add-loc")
        var $flightSubmit = $flightplan_basic.find(".flight-submit")
        var $flightEnd = $flightplan_basic.find(".flight-end")

        if (!flight_plan) {
            $flightSubmit.show()
            $flightSubmit.on("click", function (e) {
                var points = cesium_mod_flightplan.getPointsPosition()
                var coordinates = points.map(p => [p.lon, p.lat])

                var start_at = moment($startDT.val(), "DD.MM.YYYY HH:mm").utc().format()
                var end_at = moment($endDT.val(), "DD.MM.YYYY HH:mm").utc().format()

                var radius = $radiusSlider.slider("value")

                var parts = [{
                    "id": "1",
                    "geography": {
                        "type": "Polygon",
                        "coordinates": [coordinates],
                    },
                    "start": start_at,
                    "end": end_at,
                    "maxAltitude": {
                        "datum": "agl",
                        "meters": FLIGHTPLAN_OFFSET
                    }
                }]
                var data = {
                    summary: $summary.val(),
                    description: $description.val(),
                    lon: $lon.val(),
                    lat: $lat.val(),
                    parts: parts,
                    radius: radius,
                    start_at: start_at,
                    end_at: end_at,
                }

                flightplan_postData(data)
            })

            $addLoc.on("click", function (e) {
                if (flightplan_add_mode === true) {
                    $addLoc.html("Add location")
                    flightplan_add_mode = false
                } else {
                    $addLoc.html("Double click on map")
                    flightplan_add_mode = true
                }
            })

            $lat.on("input", function (event) {
                var target = $(event.target)
                var value = utils_dom_inputLonLat(target)

                cesium_mod_flightplan.map_changeLonLat(null, value)
            })

            $lon.on("input", function (event) {
                var target = $(event.target)
                var value = utils_dom_inputLonLat(target)

                cesium_mod_flightplan.map_changeLonLat(value, null)
            })

            $startDT.val(moment().add(10, 'm').format("DD.MM.YYYY HH:mm"))
            $startDT.datetimepicker({
                format: 'd.m.Y H:i',
                theme: 'dark',
                step: 5,

                onChangeDateTime: function (dp, $input) {
                    if (!$input.val()) {
                        $input.val(moment().add(10, 'm').format("DD.MM.YYYY HH:mm"))
                    }

                    var startDTValue = moment($input.val(), "DD.MM.YYYY HH:mm")

                    if ($endDT.val()) {
                        var endDTValue = moment($endDT.val(), "DD.MM.YYYY HH:mm")
                        if (endDTValue < startDTValue) {
                            $endDT.val($input.val())
                        }
                    }

                    $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
                },
                onShow: function (ct) {
                    this.setOptions({
                        minDate: moment().format("DD.MM.YYYY"),
                        minTime: moment().format("HH:mm"),
                        maxDate: $endDT.val() ? $endDT.val().split(" ")[0] : false,
                        maxTime: $endDT.val() ? $endDT.val().split(" ")[1] : false,
                    })
                },
            })

            $endDT.val(moment().add(40, 'm').format("DD.MM.YYYY HH:mm"))
            $endDT.datetimepicker({
                format: 'd.m.Y H:i',
                theme: 'dark',
                step: 5,
                onChangeDateTime: function (dp, $input) {
                    if (!$input.val()) {
                        $input.val(moment().add(40, 'm').format("DD.MM.YYYY HH:mm"))
                    }

                    var endDTValue = moment($input.val(), "DD.MM.YYYY HH:mm")

                    if ($startDT.val()) {
                        var startDTValue = moment($startDT.val(), "DD.MM.YYYY HH:mm")
                        if (startDTValue > endDTValue) {
                            $startDT.val($input.val())
                        }
                    }

                    $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
                },
                onShow: function (ct) {
                    this.setOptions({
                        minDate: $startDT.val() ? $startDT.val().split(" ")[0] : moment().format("DD.MM.YYYY"),
                        minTime: $startDT.val() ? $startDT.val().split(" ")[1] : moment().format("HH:mm"),
                    })
                },
            })

            $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
            flightplan_interval = setInterval(function () {
                $infoDT.text(flightplan_get_datetime_info($startDT, $endDT))
            }, 1000)
        } else {
            $flightEnd.on("click", function (e) {
                flightPlan_endRequest(flight_plan.flight_plan_id)
            })

            $summary.val(flight_plan.summary)
            $summary.prop("disabled", true)

            $description.val(flight_plan.description)
            $description.prop("disabled", true)

            $lat.val(flight_plan.lat)
            $lat.prop("disabled", true)

            $lon.val(flight_plan.lon)
            $lon.prop("disabled", true)

            var start_at = moment(flight_plan.start_at)
            $startDT.val(start_at.format("DD.MM.YYYY HH:mm"))
            $startDT.prop("disabled", true)

            var end_at = moment(flight_plan.end_at)
            $endDT.val(end_at.format("DD.MM.YYYY HH:mm"))
            $endDT.prop("disabled", true)

            var check_end_flight = function () {
                var now = moment()
                if (start_at < now) {
                    if (now > end_at) {
                        $flightEnd.hide()
                        flightplan_getData()
                    } else {
                        var diff = (end_at - now)
                        $flightEnd.html("End Flight (" + moment(diff).format('HH:mm:ss') + ")")
                        $flightEnd.show()
                    }
                } else {
                    var diff = (start_at - now)
                    $flightEnd.html("Flight start in (" + moment(diff).format('HH:mm:ss') + ")<br><small>Click to end the flight</small>")
                    $flightEnd.show()
                }
            }
            check_end_flight()
            flightplan_interval = setInterval(check_end_flight, 1000)
        }

        $radiusSlider.slider({
            min: 100,
            max: 1000,
            value: flight_plan ? flight_plan.radius : FLIGHTPLAN_RADIUS,
            disabled: !!flight_plan,
            create: function () {
                $radiusHandler.text($(this).slider("value") + " m");
            },
            slide: function (event, ui) {
                cesium_mod_flightplan.map_changeRadius(Number(ui.value))

                $radiusHandler.text(ui.value + " m");
            }
        })

        return $flightplan_basic
    }

    function handler_setFlightPlan(cartesian, radius) {
        flightplan_add_mode = false
        cesium_mod_flightplan.map_renderLoc(cartesian, radius)
        var {lon, lat} = cesium_mod_flightplan.getCenterPosition()

        $(".flight-add-loc-row").hide()
        $(".flight-loc-row").show()
        $(".flight-submit").prop("disabled", false)
        dom_setLocLonLat(lon, lat)
    }

    function handler_doRepositionOrSelectDrone(movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
            var picketObjectName = pickedObject.id.name + ""

            // If found, replace current
            if (picketObjectName.includes("drone")) {
                var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");

                cesium_mod_drone.map_selectDrone(link_uuid)
                dom_selectDrone(link_uuid)
                return // don't reposition at this point
            }
        }

        // If has selectedEntity - do reposition
        if (viewer.selectedEntity) {
            var cartesian = utils_getCartesianFromMovement(movement.position)

            if (cartesian) {
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                var lat = Cesium.Math.toDegrees(cartographic.latitude)
                var lon = Cesium.Math.toDegrees(cartographic.longitude)
                var alt = 30
                var speed = 5

                var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");

                if (link_uuid && lat && lon && alt) {
                    var repositionModal = $("#reposition-modal")

                    repositionModal.find(".lat").text(lat.toFixed(8) + ' deg')
                    repositionModal.find(".lon").text(lon.toFixed(8) + ' deg')
                    repositionModal.find(".alt").val(alt.toFixed(1))
                    repositionModal.find(".speed").val(speed.toFixed(1))

                    repositionModal.modal("show")
                    repositionModal.on("click", ".btn-primary", function (e) {
                        var $drone = $('.drone[link-uuid=' + link_uuid + ']');
                        var ap = Number($($drone).attr('data-mav-autopilot'))
                        var sysid = Number($($drone).attr('data-id'))

                        // Identify type of the autopilot
                        if (sysid) {
                            if (ap == 18) {
                                // SmartAP
                                get_mavlink_mod_commands(link_uuid).mav_send_DO_REPOSITION_SMARTAP(sysid, lat, lon, Number(repositionModal.find(".alt").val()), Number(repositionModal.find(".speed").val()))
                            } else {
                                // PX4 etc
                                get_mavlink_mod_commands(link_uuid).mav_send_DO_REPOSITION_PX4(sysid, lat, lon, Number(repositionModal.find(".alt").val()) + cartographic.height, Number(repositionModal.find(".speed").val()))
                            }
                        }

                        repositionModal.modal("hide")
                        repositionModal.off("click", ".btn-primary")
                    })
                }
            }
        }
    }

    function handler_addOrRemoveMissionEntities(movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
            // REMOVE
            var picketObjectName = pickedObject.id.name + ""

            if (picketObjectName !== "home") {
                if (picketObjectName.includes("pov")) {
                    var pov_index = picketObjectName.replace(/\D/g, "");

                    cesium_mod_mission.map_removePOVPoint(pov_index)
                    cesium_mod_mission.map_setCurrentIndex(null)
                } else {
                    var point_index = picketObjectName.replace(/\D/g, "");

                    cesium_mod_mission.map_removePoint(point_index)
                    cesium_mod_mission.map_setCurrentIndex(null)
                }
            }
        } else {
            // ADD
            var cartesian = utils_getCartesianFromMovement(movement.position)

            if (cartesian) {
                var {lon, lat, alt} = utils_getLonLatAltFromCartesian(cartesian)

                if (cesium_mod_mission.map_getAddPOVMode() === true) {
                    cesium_mod_mission.map_addPOVPoint(lon, lat, alt)
                } else {
                    cesium_mod_mission.map_addPoint(lon, lat, alt)
                }
            }
        }
    }

    function drone_stopFollow(movement) {
        if (viewer.trackedEntity) {
            cesium_mod_drone.map_trackDrone(undefined)
            dom_trackDrone(undefined)
        }
    }

    function dom_trackDrone(link_uuid) {
        var droneBlocks = $drones.children(".drone-block")

        droneBlocks.each(function (_, element) {
            var data_uuid = $(element).attr('link-uuid')

            if (link_uuid != data_uuid) {
                $(element).find(".set-view i").toggleClass('fa-eye-slash', false)
                $(element).find(".set-view i").toggleClass('fa-eye', true)

                $(element).find(".set-view-around i").toggleClass('fa-ban', false)
                $(element).find(".set-view-around i").toggleClass('fa-sync-alt', true)
            }
        })
    }

    function dom_selectDrone(link_uuid) {
        var droneBlocks = $drones.children(".drone-block")

        droneBlocks.each(function (_, element) {
            var data_uuid = $(element).attr('link-uuid')

            $(element).toggleClass('active', link_uuid == data_uuid)
        })

        let mavlinkconn = MAWLINK_CONNS.find(x => x.uuid === link_uuid)
        if (!mavlinkconn || mavlinkconn.access_level == 0) {
            $('.mission-form-cancel').click()
            $('.select-mission').hide()
        } else {
            $('.select-mission').show()
        }
    }

    function dom_setLocLonLat(lon, lat) {
        $(".flight-lon").val(Number(Number(lon).toFixed(8)))
        $(".flight-lat").val(Number(Number(lat).toFixed(8)))
    }

    // Drone
    $(document).on('click', '.drone-block .set-view', function (e) {
        e.stopPropagation()

        var $target = $(e.target)
        var $drone = $target.closest('.drone-block')
        var $icon = $target.hasClass("set-view") ? $target.find("i") : $target

        var link_uuid = $drone.attr('link-uuid')

        if ($icon.hasClass("fa-eye")) {
            $icon.toggleClass('fa-eye', false);
            $icon.toggleClass('fa-eye-slash', true);

            cesium_mod_drone.map_trackDrone(link_uuid)
            dom_trackDrone(link_uuid)
        } else if ($icon.hasClass("fa-eye-slash")) {
            $icon.toggleClass('fa-eye', true);
            $icon.toggleClass('fa-eye-slash', false);

            cesium_mod_drone.map_trackDrone(undefined)
            dom_trackDrone(undefined)
        }

        $drone.find(".set-view-around i").toggleClass('fa-sync-alt', true);
        $drone.find(".set-view-around i").toggleClass('fa-ban', false);
    })

    // Drone
    $(document).on('click', '.drone-block .set-view-around', function (e) {
        e.stopPropagation()

        var $target = $(e.target)
        var $drone = $target.closest('.drone-block')
        var $icon = $target.hasClass("set-view-around") ? $target.find("i") : $target

        var link_uuid = $drone.attr('link-uuid')

        if ($icon.hasClass("fa-sync-alt")) {
            $icon.toggleClass('fa-sync-alt', false);
            $icon.toggleClass('fa-ban', true);

            cesium_mod_drone.map_trackDrone(link_uuid, true)
            dom_trackDrone(link_uuid)
        } else if ($icon.hasClass("fa-ban")) {
            $icon.toggleClass('fa-sync-alt', true);
            $icon.toggleClass('fa-ban', false);

            cesium_mod_drone.map_trackDrone(undefined)
            dom_trackDrone(undefined)
        }

        $drone.find(".set-view i").toggleClass('fa-eye', true);
        $drone.find(".set-view i").toggleClass('fa-eye-slash', false);
    })

    $(document).on('click', '.drone-block', function (e) {
        var $target = $(e.target)
        var $drone = $target.closest('.drone-block')

        var is_active = $drone.hasClass('active');
        var link_uuid = $drone.attr('link-uuid')

        if (!is_active) {
            cesium_mod_drone.map_selectDrone(link_uuid)
            dom_selectDrone(link_uuid)
        }
    })

    $(document).on('click', '.fov-visibility', function (e) {
        cesium_mod_drone.map_fovToggleVisibility()
    })

    // Mission
    $(document).on('click', '.select-mission', function (e) {
        $selectMissionModal.modal('show')
    })

    $(document).on('click', '.mission-preview', function (e) {
        var $target = $(e.target)
        var $preview = $target.closest('.mission-preview')

        var missionId = Number($preview.attr('data-id'));
        var missionName = $preview.find(".mission-preview__description__name").text()
        var missionJSON = $('#mission-data-' + missionId).text()

        if (missionJSON && missionJSON != "\"\"" && missionJSON != "{}") {
            $missionForm.attr('action', get_mission_update_url(missionId))
            $missionForm.show()
            $alertAddPoint.show()
            cesium_mod_mission.map_destroy()

            var mission = cesium_mod_mission.js_parseMission(missionJSON)
            var home_position = mission.home_position
            var home_address = mission.home_address
            var actions = mission.actions

            mission_current = {
                id: missionId,
                mission: mission,
            }

            cesium_mod_mission.map_addHomePoint(home_position.lon, home_position.lat, 0.0, home_address)
            dom_mod_mission.dom_setName(missionName)

            actions.forEach(function (action) {
                cesium_mod_mission.map_addPoint(
                    action.lon, action.lat, action.alt, action.offset,
                    action.speed, action.delay, action.heading, action.command, action.pov
                )
            })
        }

        $selectMissionBtn.hide()
        $selectMissionModal.modal('hide')

        cesium_mode_missions_on_map.toggleVisibility(false)
    })

    $(document).on('click', '.mission-form .tag', function (e) {
        if ($missionForm.hasClass('closed')) {
            $alertAddPoint.show()
        } else {
            $alertAddPoint.hide()
        }

        $missionForm.toggleClass('closed')
    })

    $(document).on('click', '.mission-form .mission-form-upload', function (e) {
        var mission = cesium_mod_mission.js_createMission()
        var mission_json = JSON.stringify(mission)
        var sysid = $(".drone-block.active").attr('data-id')
        var link_uuid = $(".drone-block.active").attr('link-uuid')

        if (sysid && link_uuid) {
            get_mavlink_mod_missions(link_uuid).run(mission_json, sysid)
            $missionForm.toggleClass("closed", true)
            $alertAddPoint.hide()
        }
    })

    $(document).on('click', '.mission-form .mission-form-cancel', function (e) {
        cesium_mod_mission.map_destroy()
        $missionForm.hide()
        $alertAddPoint.hide()
        $selectMissionBtn.show()

        cesium_mode_missions_on_map.toggleVisibility(true)

        mission_current = undefined
    })

    $(document).on('click', '.mission-form .mission-form-save', function (e) {
        if (saveDisabled === false) {
            saveDisabled = true

            var mission = cesium_mod_mission.js_createMission()

            var missionString = JSON.stringify(mission)

            $('.mission-json').val(missionString)

            $('.mission-form-save').html('<div class="spinner-border text-white" />')

            cesium_mod_mission.map_takeScreenshot().then(function (blob) {
                var formAction = $missionForm.attr('action')
                var formData = new FormData($missionForm[0]);

                var file = new File([blob], "mission-.png")

                formData.append('thumbnail', file);

                $.ajax({
                    url: formAction,
                    data: formData,
                    type: 'POST',
                    async: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        saveDisabled = false
                        $('.mission-form-save').html('Save')
                        $('#mission-data-' + mission_current.id).text(missionString)

                        // map_renderMissionsOnMap()
                    },
                    error: function (error) {
                        saveDisabled = false
                        $('.mission-form-save').html('Retry')
                    }
                })
            })
        }
    })

    $(document).on('submit', '.mission-form', function (e) {
        e.preventDefault()
    })

    // Map data
    $(document).on('click', '.mapdata-context-info .tag', function (e) {
        $mapdataContextInfo.hide()
        $mapdataContextInfoContent.html("")
        cesium_mod_mapdata.setUnselected(mapdata_selected_ids)

        if (flightplan_open) {
            clearInterval(flightplan_interval)
            flightplan_open = false
            flightplan_add_mode = false
            cesium_mod_flightplan.map_removeLoc()

            $missionForm.toggleClass("busy", false)
        }
    })

    $(document).on('click', '.mapdata-selector .map-data-items .item', function (e) {
        var $target = $(e.target).closest('.mapdata-selector .map-data-items .item')
        var is_checked = $target.hasClass("checked")
        var was_all_unchecked = mapdata_isAllUnchecked() // All unchecked also if feature_mapdata_is_active == False, by logic

        $target.toggleClass("checked", !is_checked)

        if (was_all_unchecked) {
            mapdata_getData().then(mapdata_restoreVisibility)
        } else {
            mapdata_restoreVisibility()
        }

        if (mapdata_isAllUnchecked) {
            $mapdataIndicatorInfo.html('')
            $mapdataIndicatorInfo.show()
        }

        mapdata_saveToLocalStorage()
    })

    $(document).on('click', '.mapdata-selector .flight-plan-items .item', function (e) {
        var $target = $(e.target)

        var flight_plan_id = $target.data("id")
        var plan = flightplan_data.find(p => p.flight_plan_id == flight_plan_id)

        if (!plan.mission) {
            var cartesian = Cesium.Cartesian3.fromDegrees(plan.lon, plan.lat, 5000)
            cesium_mod_flightplan.map_renderLoc(cartesian, plan.radius)
            cesium_mod_flightplan.map_flyToLoc()

            flightplan_renderDetails(plan)
        } else {
            $('.mission-preview[data-id="' + plan.mission + '"]').click()
            flightplan_renderDetails(plan)
        }

        $mapdataContextInfo.show()
        flightplan_open = true
    })

    $(document).on('click', '.mapdata-selector .submit-flight-plan', function (e) {
        var $template
        var dronePosition = false

        if (mission_current) {
            $missionForm.toggleClass("busy", true)
            $template = flightplan_get_template_mission(null, mission_current)
        } else if ($(".drone-block.active").length > 0 && viewer.selectedEntity) {
            var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");
            var drone_pos = cesium_mod_drone.map_getDronePosition(link_uuid)

            dronePosition = Cesium.Cartesian3.fromDegrees(drone_pos.lon, drone_pos.lat)
            $template = flightplan_get_template_basic()
        } else {
            $template = flightplan_get_template_basic()
        }

        $mapdataContextInfoContent.html("")
        $template.appendTo($mapdataContextInfoContent)
        $mapdataContextInfoContent.scrollTop(0)

        $mapdataContextInfo.show()
        flightplan_open = true

        if (dronePosition) {
            handler_setFlightPlan(dronePosition, FLIGHTPLAN_RADIUS)
        }
    })


    function initCesiumData() {
        flightplan_getData()
        mapdata_loadFromLocalStorage()

        // map_renderMissionsOnMap()

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lon = position.coords.longitude
                var lat = position.coords.latitude

                setTimeout(function () {
                    if ($(".drone-block.active").length == 0) {
                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(lon, lat, 6000000),
                            duration: 5.0,
                        });
                    }
                }, 1200)
            })
        }
    }
})()
