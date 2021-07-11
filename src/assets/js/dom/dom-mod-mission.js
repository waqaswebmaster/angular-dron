var __dom_mod_mission = null

// for lazy access
function get_dom_mod_mission() {
    return __dom_mod_mission || {}
}

// for initial access
function init_dom_mod_mission(mission_allow_edit, mission_has_name) {
    if (__dom_mod_mission) return __dom_mod_mission

    // DOM: Vars
    var waypoints = $('.mission-waypoints');
    alert('waypoints')
    // DOM: Add and remove waypoint
    function dom_addPoint(point_index, lon, lat, alt, offset, speed, delay, heading, command) {
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        if (!waypoint.length) {
            waypoint = $($('template.waypoint').html())
            waypoint.attr('data-id', point_index);

            console.log('waypoint', waypoint);

            var commandInput = waypoint.find(".command")

            var pointLatInput = waypoint.find(".lat")
            var pointLonInput = waypoint.find(".lon")

            var altitudeInput = waypoint.find(".altitude")
            var altitudeMinus = waypoint.find(".altitude-minus")
            var altitudePlus = waypoint.find(".altitude-plus")

            var speedInput = waypoint.find(".speed")
            var speedMinus = waypoint.find(".speed-minus")
            var speedPlus = waypoint.find(".speed-plus")

            var delaySlider = waypoint.find(".range .delay")
            var delayHandler = waypoint.find(".range .delay .custom-handle")

            var headingSlider = waypoint.find(".range .heading")
            var headingHandler = waypoint.find(".range .heading .custom-handle")


            commandInput.val(command)

            speedInput.val(Number(speed).toFixed())

            console.log('delaySlider', delaySlider);

            delaySlider.slider({
                min: 0,
                max: 60,
                value: delay,
                disabled: !mission_allow_edit,
                create: function () {
                    delayHandler.text($(this).slider("value") + " sec");
                },
                slide: function (event, ui) {
                    get_cesium_mod_mission().map_setPointDelay(point_index, Number(ui.value))

                    delayHandler.text(ui.value + " sec");
                }
            })

            headingSlider.slider({
                min: 0,
                max: 360,
                value: heading,
                disabled: !mission_allow_edit,
                create: function () {
                    headingHandler.text($(this).slider("value") + " deg");
                },
                slide: function (event, ui) {
                    get_cesium_mod_mission().map_setPointHeading(point_index, Number(ui.value))

                    headingHandler.text(ui.value + " deg");
                }
            })

            if (mission_allow_edit) {
                commandInput.on("change", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    get_cesium_mod_mission().map_setPointCommand(point_index, value)
                })

                pointLonInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

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

                    get_cesium_mod_mission().map_setGroundPointPositions("ground" + point_index, value, null)
                })

                pointLatInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

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

                    get_cesium_mod_mission().map_setGroundPointPositions("ground" + point_index, null, value)
                })

                altitudeInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    value = Number(value.replace(/[^0-9]/g, ''));
                    if (!value) {
                        value = 0
                    }

                    get_cesium_mod_mission().map_setPointOffset(point_index, value)
                })

                altitudeMinus.on("click", function (event) {
                    if (get_cesium_mod_mission().map_getPointOffset(point_index) - 1 > 0) {
                        var value = Number(altitudeInput.val()) - 1

                        altitudeInput.val(value)

                        get_cesium_mod_mission().map_setPointOffset(point_index, value)
                    }
                })

                altitudePlus.on("click", function (event) {
                    var value = Number(altitudeInput.val()) + 1

                    altitudeInput.val(value)

                    get_cesium_mod_mission().map_setPointOffset(point_index, value)
                })

                speedInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    value = value.replace(/\D/g, '');
                    if (!value) {
                        value = 0
                    }
                    target.val(value)

                    get_cesium_mod_mission().map_setPointSpeed(point_index, Number(value))
                })

                speedMinus.on("click", function (event) {
                    if (get_cesium_mod_mission().map_getPointSpeed(point_index) - 1 > 0) {
                        var value = Number(speedInput.val()) - 1

                        speedInput.val(value)

                        get_cesium_mod_mission().map_setPointSpeed(point_index, Number(value))
                    }
                })

                speedPlus.on("click", function (event) {
                    var value = Number(speedInput.val()) + 1

                    speedInput.val(value)

                    get_cesium_mod_mission().map_setPointSpeed(point_index, Number(value))
                })
            } else {
                commandInput.prop("disabled", true);

                pointLatInput.prop("disabled", true);
                pointLonInput.prop("disabled", true);

                altitudeInput.prop("disabled", true);
                altitudeMinus.prop("disabled", true).hide();
                altitudePlus.prop("disabled", true).hide();

                speedInput.prop("disabled", true);
                speedMinus.prop("disabled", true).hide();
                speedPlus.prop("disabled", true).hide();

            }

            waypoint.appendTo(waypoints);

            dom_setPointLonLat(point_index, lon, lat)
            dom_setPointOffset(point_index, offset)
        }
    }

    // DOM: Update remove waypoint
    function dom_removePoint(point_index) {
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        waypoint.remove()
    }

    // DOM: Update waypoint offset
    function dom_setPointOffset(point_index, offset) {
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        waypoint.find(".altitude").val(Number(offset))
    }

    // DOM: Update waypoint lat lon
    function dom_setPointLonLat(point_ground_index, lon, lat) {
        let point_index = (point_ground_index + "").replace(/\D/g, "")
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        waypoint.find(".lon").val(Number(Number(lon).toFixed(8)))
        waypoint.find(".lat").val(Number(Number(lat).toFixed(8)))
    }

    // DOM: Update home lat lon, address, weather
    function dom_setHomeLonLat(lon, lat) {
        $("input.mission-lat").val(Number(lat).toFixed(8))
        $("input.mission-lon").val(Number(lon).toFixed(8))

        $("span.mission-lat").text(Number(lat).toFixed(8) + ", ")
        $("span.mission-lon").text(Number(lon).toFixed(8))
    }

    function dom_setHomeAddress(address) {
        $(".mission-address").text(address)

        if (!mission_has_name) {
            // Else set name, as initial name
            $("textarea.mission-name").val(address)
            $("span.mission-name").text(address)
        }
    }

    function dom_setName(name) {
        $("textarea.mission-name").val(name)
        $("span.mission-name").text(name)
    }

    function dom_getName() {
        return $("textarea.mission-name").val()
    }

    function dom_setHomeWeather(temperature) {
        $(".mission-weather").text(temperature.toFixed(1))
    }

    // DOM: Collapse uncollapse waypoint
    function dom_collapseAllPoints(ignore_id) {
        var waypointBlocks = waypoints.children(".waypoint")

        waypointBlocks.each(function (_, element) {
            var waypoint = $(element)
            var point_index = Number(waypoint.attr('data-id'))

            if (ignore_id != point_index) {
                waypoint.find(".collapse").collapse("hide")
            }
        })
    }

    function dom_collapseShowPoint(point_index) {
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');
        waypoint.find(".collapse").collapse("show")
        dom_collapseAllPoints(point_index)
    }

    // DOM: Calculate waypoint titles
    function dom_setPointsTitle(labels) {
        var waypointBlocks = waypoints.children(".waypoint")

        waypointBlocks.each(function (_, element) {
            var waypoint = $(element)
            var point_index = Number(waypoint.attr('data-id'))

            var waypointType = waypoint.find(".command").val()
            var waypointLabel = labels[point_index]

            waypoint.find(".title").text(waypointLabel + " " + waypointType)
        })
    }

    // DOM: Calculate waypoint count
    function dom_setPointsCount(count) {
        $("span.mission-waypoints-count").text(count)
        $("input.mission-waypoints-count").val(count)
    }

    // DOM: Update distance and duration
    function dom_setDistanceAndDuration(data) {
        var duration = data.duration
        var distance = data.distance
        var formatted

        if (duration) {
            formatted = utils_secondsToHms(duration)

            $("span.mission-duration").text(formatted)
            $("input.mission-duration").val(duration)
        } else {
            $("span.mission-duration").text(0)
            $("input.mission-duration").val(0)
        }

        if (distance) {
            formatted = utils_metersToKM(distance)

            $("span.mission-distance").text(formatted)
            $("input.mission-distance").val(distance.toFixed(2))
        } else {
            $("span.mission-distance").text(0)
            $("input.mission-distance").val(0)
        }
    }

    // POV
    function dom_addPOVPoint(pov_index, lon, lat, offset) {
        let point_index = (pov_index + "").replace(/\D/g, "")
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        if (waypoint.length) {
            var pov_buttons = waypoint.find('.pov-buttons')
            var pov_elements = waypoint.find('.pov-elements')

            var povLatInput = waypoint.find(".pov-lat")
            var povLonInput = waypoint.find(".pov-lon")
            var povAltInput = waypoint.find(".pov-alt")

            if (mission_allow_edit) {
                povLatInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    value = Number(value)

                    get_cesium_mod_mission().map_setPOVGroundPointPositions("pov_ground" + point_index, null, value)
                })

                povLonInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    value = Number(value)

                    get_cesium_mod_mission().map_setPOVGroundPointPositions("pov_ground" + point_index, value, null)
                })

                povAltInput.on("input", function (event) {
                    var target = $(event.target)
                    var value = target.val()

                    value = Number(value.replace(/\D/g, ''));

                    if (!value) {
                        value = 0
                    }

                    target.val(value)

                    get_cesium_mod_mission().map_setPOVPointOffset("pov" + point_index, value)
                })
            } else {
                povLatInput.prop("disabled", true);
                povLonInput.prop("disabled", true);

                povAltInput.prop("disabled", true);
            }

            dom_setPOVPointLonLat(pov_index, lon, lat)
            dom_setPOVPointOffset(pov_index, offset)

            pov_buttons.hide()
            pov_elements.show()

            dom_POVResetMode()
        }
    }

    function dom_removePOVPoint(pov_index) {
        let point_index = (pov_index + "").replace(/\D/g, "")
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        if (waypoint.length) {
            var pov_buttons = waypoint.find('.pov-buttons')
            var pov_elements = waypoint.find('.pov-elements')

            pov_buttons.show()
            pov_elements.hide()

            dom_POVResetMode()
        }
    }

    function dom_setPOVPointLonLat(pov_point_ground_index, lon, lat) {
        let point_index = (pov_point_ground_index + "").replace(/\D/g, "")
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        if (waypoint.length) {
            waypoint.find(".pov-lat").val(Number(Number(lat).toFixed(8)))
            waypoint.find(".pov-lon").val(Number(Number(lon).toFixed(8)))
        }
    }

    function dom_setPOVPointOffset(pov_index, offset) {
        let point_index = (pov_index + "").replace(/\D/g, "")
        let waypoint = waypoints.find('.waypoint[data-id=' + point_index + ']');

        if (waypoint.length) {
            waypoint.find(".pov-alt").val(Number(offset).toFixed())
        }
    }

    function dom_POVResetMode() {
        get_cesium_mod_mission().map_setAddPOVMode(false)

        $('.pov-create').prop("disabled", false)
        $('.pov-create').show()
        $('.pov-cancel').hide()

        $('.add-point-alert').hide()
        $('.pov-alert').hide()
    }

    // Utils
    function utils_secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + "h" : "";
        var mDisplay = m > 0 ? m + "m" : "";
        var sDisplay = s > 0 ? s + "s" : "";

        var result = ""
        if (hDisplay) {
            result += hDisplay + " "
        }

        if (mDisplay) {
            result += mDisplay + " "
        }

        if (sDisplay) {
            result += sDisplay + " "
        }

        return result.trim()
    }

    function utils_metersToKM(d) {
        d = Number(d);
        var k = Math.floor(d / 1000);
        var m = Math.floor(d % 1000);

        var kDisplay = k > 0 ? k + "km" : "";
        var mDisplay = m > 0 ? m + "m" : "";

        var result = ""

        if (kDisplay) {
            result += kDisplay + " "
        }

        if (mDisplay) {
            result += mDisplay + " "
        }

        return result.trim()
    }

    $(document).on('click', '.alert-close', function (e) {
        if (mission_allow_edit) {
            $('.alert').hide()
        }
    })

    $(document).on('click', '.waypoint .delete-icon', function (e) {
        if (mission_allow_edit) {
            var target = $(e.target)
            var waypoint = target.closest('.waypoint')
            var point_index = Number(waypoint.attr('data-id'));

            get_cesium_mod_mission().map_removePoint(point_index)
        }
    })

    $(document).on('click', '.waypoint .pov-delete-icon', function (e) {
        if (mission_allow_edit) {
            var target = $(e.target)
            var waypoint = target.closest('.waypoint')
            var point_index = Number(waypoint.attr('data-id'));

            get_cesium_mod_mission().map_removePOVPoint(point_index)
        }
    })

    $(document).on('click', '.waypoint .pov-create', function (e) {
        $('.pov-create').prop("disabled", true)

        var $target = $(e.target)
        var $waypoint = $target.closest('.waypoint')

        var $cancel_btn = $waypoint.find('.pov-cancel')
        var $create_btn = $waypoint.find('.pov-create')

        $create_btn.hide()
        $cancel_btn.show()

        get_cesium_mod_mission().map_setAddPOVMode(true)
    })

    $(document).on('click', '.waypoint .pov-cancel', function (e) {
        $('.pov-create').prop("disabled", false)

        var $target = $(e.target)
        var $waypoint = $target.closest('.waypoint')

        var $cancel_btn = $waypoint.find('.pov-cancel')
        var $create_btn = $waypoint.find('.pov-create')

        $create_btn.show()
        $cancel_btn.hide()

        get_cesium_mod_mission().map_setAddPOVMode(false)
    })

    $(document).on('input', '.mission-name', function (e) {
        if (mission_allow_edit) {
            mission_has_name = true
        }
    })

    $(document).on('change', '.mission-name', function (e) {
        if (mission_allow_edit) {
            if (e.target.value == "") {
                e.target.value = $(".mission-address").text()
            }
        }
    })

    $(document).on('click', '.mission-name-edit', function (e) {
        if (mission_allow_edit) {
            var $textarea = $("textarea.mission-name")
            var $span = $("span.mission-name")
            var $icon = $(".mission-name-edit")

            var inputIsVisible = $textarea.css("display") == "none"

            if (inputIsVisible) {
                $textarea.css("display", "inline")
                $span.css("display", "none")
                $icon.removeClass("far")
                $icon.addClass("fas")

                setTimeout(function () {
                    $textarea.height($textarea.prop("scrollHeight"));
                    $textarea.focus()
                }, 0)
            } else {
                $textarea.css("display", "none")
                $span.css("display", "inline")
                $icon.removeClass("fas")
                $icon.addClass("far")

                $span.text($textarea.val())
            }
        }
    })

    $(document).on('click', '.mission-form .mission-waypoints .waypoint .title', function (e) {
        var target = $(e.target)
        var waypoint = target.closest('.waypoint')
        var point_index = Number(waypoint.attr('data-id'));

        var collapse = waypoint.find(".collapse")

        var wasOpened = collapse.hasClass("show")

        collapse.collapse("toggle")

        dom_POVResetMode()

        dom_collapseAllPoints(point_index)

        get_cesium_mod_mission().map_setCurrentIndex(wasOpened ? null : point_index)
    })

    return __dom_mod_mission = {
        dom_addPoint: dom_addPoint,
        dom_removePoint: dom_removePoint,
        dom_setPointOffset: dom_setPointOffset,
        dom_setPointLonLat: dom_setPointLonLat,
        dom_setHomeLonLat: dom_setHomeLonLat,
        dom_setHomeAddress: dom_setHomeAddress,
        dom_setHomeWeather: dom_setHomeWeather,
        dom_collapseAllPoints: dom_collapseAllPoints,
        dom_collapseShowPoint: dom_collapseShowPoint,
        dom_setPointsTitle: dom_setPointsTitle,
        dom_setPointsCount: dom_setPointsCount,
        dom_setDistanceAndDuration: dom_setDistanceAndDuration,

        dom_addPOVPoint: dom_addPOVPoint,
        dom_removePOVPoint: dom_removePOVPoint,
        dom_setPOVPointLonLat: dom_setPOVPointLonLat,
        dom_setPOVPointOffset: dom_setPOVPointOffset,

        dom_setName: dom_setName,
        dom_getName: dom_getName,
    }
}
