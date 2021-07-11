(function () {
    // Connection parameters
    const CONNECTION_LOSS_INTERVAL = 3000;

    // Message Definitions
    const MAVLINK_MSG_ID_HEARTBEAT = 0;
    const MAVLINK_MSG_ID_SYS_STATUS = 1;
    const MAVLINK_MSG_ID_GPS_RAW_INT = 24;
    const MAVLINK_MSG_ID_ATTITUDE = 30;
    const MAVLINK_MSG_ID_GLOBAL_POSITION_INT = 33;
    const MAVLINK_MSG_ID_MISSION_CURRENT = 42;
    const MAVLINK_MSG_ID_STATISTICS = 201;
    const MAVLINK_MSG_ID_LTE_INFORMATION = 204;
    const MAVLINK_MSG_ID_HOME_POSITION = 242;
    const MAVLINK_MSG_ID_SET_HOME_POSITION = 243;
    const MAVLINK_MSG_ID_STATUSTEXT = 253;
    const MAVLINK_MSG_ID_CAMERA_CAPTURE_STATUS = 262;
    const MAVLINK_MSG_ID_LOGGING_DATA = 266;
    const MAVLINK_MSG_ID_ORBIT_EXECUTION_STATUS = 360;
    const MAVLINK_MSG_ID_ONBOARD_COMPUTER_VERSION = 389;

    // MODE ENUMS
    const MAV_MODE_FLAG_MANUAL_INPUT_ENABLED = 64;
    const MAV_MODE_FLAG_SAFETY_ARMED = 128;

    // MAV_AUTOPILOT ENUMS
    const MAV_AUTOPILOT_GENERIC = 0;
    const MAV_AUTOPILOT_ARDUPILOTMEGA = 3;
    const MAV_AUTOPILOT_PX4 = 12;
    const MAV_AUTOPILOT_SMARTAP = 18;

    // MAV_TYPE ENUMS
    const MAV_TYPE_GENERIC = 0;
    const MAV_TYPE_FIXED_WING = 1;
    const MAV_TYPE_QUADROTOR = 2;


    function mav_type_to_string(mav_type) {
        switch (mav_type) {
            case 0:
                return 'Generic';
            case 1:
                return 'Plane';
            case 2:
                return 'Copter';
            default:
                return 'Drone';
        }
    }

    function parseMode(autopilot, baseMode, customMode) {
        if (autopilot == MAV_AUTOPILOT_SMARTAP) {
            switch (customMode) {
                case 255:
                default:
                    return 'UNDEFINED';
                case 0:
                    return 'STABILIZED';
                case 2:
                    return 'ALT HOLD';
                case 5:
                    return 'POSITION';
                case 6:
                    return 'RTH';
                case 3:
                    return 'AUTO';
                case 4:
                    return 'GUIDED';
                case 11:
                    return 'TAKE OFF';
                case 9:
                    return 'LAND';
                case 10:
                    return 'FOLLOW';
            }
        } else if (autopilot == MAV_AUTOPILOT_PX4) {
            // Convert encoded mode to string
            var customMainMode = (customMode & 0xFF0000) >> 16;
            var customSubMode = (customMode & 0xFF000000) >> 24;

            if (baseMode & MAV_MODE_FLAG_MANUAL_INPUT_ENABLED) {
                switch (customMainMode) {
                    case 1:
                        return 'MANUAL';
                    case 5:
                        return 'ACRO';
                    case 8:
                        return 'RATTITUDE';
                    case 7:
                        return 'STABILIZED';
                    case 2:
                        return 'ALTITUDE';
                    case 3:
                        return 'POSITION';
                }
            } else {
                switch (customSubMode) {
                    case 0:
                        return 'OFFBOARD';
                    case 2:
                        return 'TAKEOFF';
                    case 3:
                        return 'HOLD';
                    case 4:
                        return 'MISSION';
                    case 5:
                        return 'RTL';
                    case 6:
                        return 'LAND';
                    case 7:
                        return 'RTGS';
                    case 8:
                        return 'FOLLOWME';
                }
            }
        } else if (autopilot == MAV_AUTOPILOT_ARDUPILOTMEGA) {
            switch (customMode) {
                case 255:
                default:
                    return 'UNDEFINED';
                case 0:
                    return 'STABILIZED';
                case 2:
                    return 'ALT HOLD';
                case 5:
                    return 'HOLD';
                case 6:
                    return 'RTL';
                case 3:
                    return 'MISSION';
                case 4:
                    return 'GUIDED';
                case 11:
                    return 'TAKE OFF';
                case 9:
                    return 'LAND';
                case 10:
                    return 'FOLLOW';
            }
        }
    }

    // Vars
    var colors = get_colors()
    var drones = $('.drones');
    var drones_last_heartbeat = {}
    var drones_interval = {}
    var drones_video_started = {}
    var viewers = []

    console.log('Video address is: ' + VIDEO_SERVER_WEBSOCKET_RECORDER_URL)
    var video_sock = new ReconnectingWebSocket(VIDEO_SERVER_WEBSOCKET_RECORDER_URL);
    var video_sock_connected = false
    video_sock.onopen = video_sock_onOpen
    video_sock.onclose = video_sock_onError
    video_sock.onerror = video_sock_onError

    function video_sock_onOpen() {
        console.log('Socket opened for video')
        video_sock_connected = true
    }

    function video_sock_onError() {
        console.log('Socket error for video')
        video_sock_connected = false
        drones_video_started = {}
        if (viewers.length > 0) {
            console.log("Termnate video streams...")
            viewers.forEach(v => v.terminate(true))
            viewers = []
        }
    }

    var STATUS_REQUEST = () => {
        $.get(LINK_STATUS_URL)
            .done(function (onlinelist) {
                openConnectioins(onlinelist)
                updateConnections(onlinelist)
                closeConnections(onlinelist)
                updateStreams(onlinelist)
                updateUI(onlinelist)
            })
    }

    function openConnectioins(onlinelist) {
        // For all onlinelist __NOT IN__ MAWLINK_CONNS
        for (let i = 0; i < onlinelist.length; i++) {
            let status_info = onlinelist[i]
            let mavlinkconn = MAWLINK_CONNS.find(x => x.uuid === status_info.uuid)

            if (!mavlinkconn) {
                let mavlink_url = MAWLINK_SERVER_WEBSOCKET_URL + "?drone=" + status_info.live_token
                let link_uuid = status_info.uuid
                let access_level = status_info.access_level || 0

                mavlink_open(link_uuid, mavlink_url, access_level)
            }
        }
    }

    function updateConnections(onlinelist) {
        // For all onlinelist __IN__ MAWLINK_CONNS
        for (let i = 0; i < onlinelist.length; i++) {
            let status_info = onlinelist[i]
            let mavlinkconn = MAWLINK_CONNS.find(x => x.uuid === status_info.uuid)

            if (mavlinkconn) {
                mavlinkconn.sock.url = MAWLINK_SERVER_WEBSOCKET_URL + "?drone=" + status_info.live_token
            }
        }
    }

    function closeConnections(onlinelist) {
        // For all MAWLINK_CONNS __NOT IN__ onlinelist
        for (let i = 0; i < MAWLINK_CONNS.length; i++) {
            let mavlinkconn = MAWLINK_CONNS[i]
            let status_info = onlinelist.find(x => x.uuid === mavlinkconn.uuid)

            if (!status_info) {
                mavlink_close(mavlinkconn.uuid, mavlinkconn.sock)
            }
        }
    }

    function updateStreams(onlinelist) {
        if (!video_sock_connected) return

        // For all onlinelist - update camera stream, if camera stream down
        for (let i = 0; i < onlinelist.length; i++) {
            let status_info = onlinelist[i]

            let viewer_camera0 = viewers.find(
                v => v.link_uuid === status_info.uuid && v.camera_id === 0
                    && (v.state === 'sdpDecline' || v.state === 'cameraOffline')
            )

            let viewer_camera1 = viewers.find(
                v => v.link_uuid === status_info.uuid && v.camera_id === 1
                    && (v.state === 'sdpDecline' || v.state === 'cameraOffline')
            )

            if (viewer_camera0 && status_info.camera0_available) {
                // console.log('Try reconnect video stream for', status_info.uuid, 'because camera0_available')
                viewer_camera0.connect()
            }

            if (viewer_camera1 && status_info.camera1_available) {
                // console.log('Try reconnect video stream for', status_info.uuid, 'because camera1_available')
                viewer_camera1.connect()
            }
        }
    }

    function updateUI(onlinelist) {
        for (let i = 0; i < onlinelist.length; i++) {
            let status_info = onlinelist[i]
            let link_uuid = status_info.uuid
            let access_level = status_info.access_level
            let drone = drones.find('.drone[link-uuid=' + link_uuid + ']')

            if (drone) {
                if (access_level == 0) {
                    drone.find('.command.command-home').hide()
                } else {
                    drone.find('.command.command-home').show()
                }
            }
        }
    }

    STATUS_REQUEST()
    setInterval(STATUS_REQUEST, 5000)

    // for manual close, not for auto reconnection by ReconnectingWebSocket
    function mavlink_close(link_uuid, mavlink_sock) {
        console.log("mavlink_close", link_uuid)
        // when closed explicitly ReconnectingWebSocket are not will be reconnect, only manual connect
        mavlink_sock.close()

        del_mavlink_mod_commands(link_uuid)

        // Cleanup cesium
        get_cesium_mod_drone().map_removeDrone(link_uuid)

        // Cleanup dom
        console.log("dom_RemoveDrone", link_uuid)
        dom_RemoveDrone(link_uuid)

        MAWLINK_CONNS = MAWLINK_CONNS.filter(x => x.uuid != link_uuid)
    }

    // for manual open
    function mavlink_open(link_uuid, mavlink_url, access_level) {
        console.log("mavlink_open", link_uuid)
        // Init connection
        var sock = new ReconnectingWebSocket(mavlink_url, sock);
        var sendMsg = msg => {
            try {sock.send(JSON.stringify(msg))} catch (e) {}
        }
        // Init mods
        init_mavlink_mod_commands(sendMsg, link_uuid)

        // Heartbeat interval
        var heartbeat_interval = null

        sock.onopen = () => {
            console.log('Connect to address is: ' + sock.url, 'for', link_uuid)
            get_mavlink_mod_commands(link_uuid).mav_send_HEARTBEAT()

            // Init heartbeat_interval
            heartbeat_interval = setInterval(get_mavlink_mod_commands(link_uuid).mav_send_HEARTBEAT, 1000)

        };
        sock.onclose = (e) => {
            console.log('Disconnect from address is: ' + mavlink_url, 'for', link_uuid)

            // Cleanup heartbeat_interval
            clearInterval(heartbeat_interval)
        }
        sock.onmessage = (e) => {
            var msg = JSON.parse(e.data);
            var sysid = msg.sysid;
            var msgid = msg.msgid;
            var drone = drones.find('.drone[link-uuid=' + link_uuid + ']');

            switch (msgid) {
                case MAVLINK_MSG_ID_HEARTBEAT:
                    let count = drones.children().length
                    let color = colors[count]

                    // Init dom
                    dom_AddDrone(link_uuid, sysid, msg.type, msg.autopilot, color);

                    // Init cesium
                    get_cesium_mod_drone().map_addDrone(link_uuid, mav_type_to_string(msg.type) + ' ' + sysid, color)

                    var mode = parseMode(msg.autopilot, msg.base_mode, msg.custom_mode);
                    var armed = Boolean(msg.base_mode & MAV_MODE_FLAG_SAFETY_ARMED);

                    if (mode === "HOLD") {
                        get_cesium_mod_drone().map_dropCircle()
                    }

                    drone.find('.flight-mode').html(mode || 'UNKNOWN');
                    drone.find('.flight-armed').toggleClass('btn-danger', armed);
                    drone.find('.flight-armed').html(armed ? 'ARMED' : 'DISARMED');
                    drone.find('.flight-armed').removeClass('disconnected')

                    drones_last_heartbeat[link_uuid] = Date.now();
                    drone.find('.drone-control-toolbar').removeClass('connection-lost')
                    drone.find('.drone-control-pfd').removeClass('connection-lost')

                    // Enable logging
                    // get_mavlink_mod_commands(link_uuid).mav_send_LOGGING_START(sysid)
                    break

                case MAVLINK_MSG_ID_GLOBAL_POSITION_INT:
                    var alt = (msg.alt / 1000)
                    var position = {
                        lon: msg.lon / 1e7,
                        lat: msg.lat / 1e7,
                        alt: alt
                    }
                    var home_alt = get_cesium_mod_drone().map_getDroneHomeAltitude(link_uuid);

                    get_cesium_mod_drone().map_updateDronePosition(link_uuid, position)


                    drone.find('.home-distance').html(get_cesium_mod_drone().map_calculateHomeDistance(link_uuid) + ' m');
                    drone.find('.altitude').html((alt - home_alt).toFixed(1) + ' m');
                    drone.find('.speed').html(Math.sqrt(msg.vx * msg.vx / 10000 + msg.vy * msg.vy / 10000).toFixed(1) + ' m/s');
                    break

                case MAVLINK_MSG_ID_ATTITUDE:
                    drone.find('.total-time').html(secondsToTime(msg.time_boot_ms / 1000, true));
                    drone.find('.roll').html(radians_to_degrees(msg.roll).toFixed() + '&deg;');
                    drone.find('.pitch').html(radians_to_degrees(msg.pitch).toFixed() + '&deg;');

                    var orintations = {
                        heading: msg.yaw - 1.5, // -1.5 it's because model has wrong default orientation
                        pitch: msg.pitch,
                        roll: msg.roll,
                    }

                    get_cesium_mod_drone().map_updateDroneOrientation(link_uuid, orintations)
                    break

                case MAVLINK_MSG_ID_SYS_STATUS:
                    var battery_remaining = (msg.battery_remaining).toFixed()
                    var battery_icon = drone.find('.battery-icon')

                    battery_icon.toggleClass('fa-battery-empty', battery_remaining == 0)
                    battery_icon.toggleClass('fa-battery-quarter', battery_remaining >= 0 && battery_remaining < 30)
                    battery_icon.toggleClass('fa-battery-half', battery_remaining >= 30 && battery_remaining < 60)
                    battery_icon.toggleClass('fa-battery-three-quarters', battery_remaining >= 60 && battery_remaining < 90)
                    battery_icon.toggleClass('fa-battery-full', battery_remaining >= 90)

                    drone.find('.battery-remaining').html(battery_remaining + '%');
                    break;

                case MAVLINK_MSG_ID_GPS_RAW_INT:
                    drone.find('.gps-satellites').html(msg.satellites_visible);
                    break

                case MAVLINK_MSG_ID_STATISTICS:
                    drone.find('.total-time').html(secondsToTime(msg.total_time, true));
                    break

                case MAVLINK_MSG_ID_LTE_INFORMATION:
                    var signal_level = msg.signal_level
                    var signal_icon = drone.find('.signal-icon')

                    signal_icon.toggleClass('fa-signal-alt-slash', signal_level <= 1)
                    signal_icon.toggleClass('fa-signal-alt-1', signal_level == 2)
                    signal_icon.toggleClass('fa-signal-alt-2', signal_level == 3)
                    signal_icon.toggleClass('fa-signal-alt-3', signal_level == 4)
                    signal_icon.toggleClass('fa-signal-alt', signal_level >= 5)

                    drone.find('.lte-network-type').html(lteNetworkTypeToText(msg.network_type));
                    drone.find('.lte-provider').html(msg.network_operator);
                    break

                case MAVLINK_MSG_ID_STATUSTEXT:
                    drone.find(".drone-control-state").text(msg.text)
                    console.log(link_uuid, sysid, msg.text)
                    break

                case MAVLINK_MSG_ID_CAMERA_CAPTURE_STATUS:
                    $(".command-video-start").hide()
                    $(".command-video-stop").show()

                    $(".camera-state").text(secondsToTime(msg.recording_time_ms / 1000, true))
                    break

                case MAVLINK_MSG_ID_HOME_POSITION:
                case MAVLINK_MSG_ID_SET_HOME_POSITION:
                    var home_position = {
                        lon: msg.longitude / 1e7,
                        lat: msg.latitude / 1e7,
                        alt: msg.altitude / 1e3
                    }
                    get_cesium_mod_drone().map_updateDroneHomePosition(link_uuid, home_position)

                    break

                case MAVLINK_MSG_ID_MISSION_CURRENT:
                    if (msg.seq != undefined) {
                        drone.find('.current-target').text(msg.seq + 1)
                    }
                    break

                case MAVLINK_MSG_ID_ORBIT_EXECUTION_STATUS:
                    console.log(msg)
                    break

                case MAVLINK_MSG_ID_LOGGING_DATA:
                    console.log(msg)
                    break

                case MAVLINK_MSG_ID_ONBOARD_COMPUTER_VERSION:
                    // console.log('Received version message', msg)
                    if (!drones_video_started[link_uuid]) {
                        var link = MAWLINK_CONNS.find(x => x.uuid == msg.uid)

                        if (link && video_sock_connected) {
                            // console.log('Link UUID ' + link.uuid)
                            var video_1 = drone.find('#videoOutput-1')[0]
                            var video_2 = drone.find('#videoOutput-2')[0]

                            let viewer_1 = new StreamViewer(video_sock, link.uuid, 0, video_1)
                            let viewer_2 = new StreamViewer(video_sock, link.uuid, 1, video_2)

                            viewer_1.connect()
                            viewer_2.connect()

                            viewers.push(viewer_1)
                            viewers.push(viewer_2)
                            drones_video_started[link_uuid] = true
                            console.log('Video started for: ' + link.uuid)
                        }
                    }

                // default:
                // console.log("default:", msgid)
            }
        }

        MAWLINK_CONNS.push({uuid: link_uuid, sock: sock, access_level})
    }

    function dom_RemoveDrone(link_uuid) {
        var drone = drones.find('.drone[link-uuid=' + link_uuid + ']')
        drone.remove()
        clearInterval(drones_interval[link_uuid])
    }

    function dom_AddDrone(link_uuid, sysid, mav_type, mav_autopilot, color) {
        var drone = drones.find('.drone[link-uuid=' + link_uuid + ']')

        if (!drone.length) {
            console.log("dom_AddDrone", link_uuid)

            drone = $($('template.drone').html())
            drone.attr('id', 'drone-block-' + sysid);
            drone.attr('data-id', sysid);
            drone.attr('data-mav-autopilot', mav_autopilot);
            drone.attr('link-uuid', link_uuid);
            drone.find('.id').html(sysid);
            drone.find('.type').html(mav_type_to_string(mav_type));
            drone.find('.carousel').attr('id', 'carousel-cameras-' + link_uuid);
            drone.find('.carousel ol li').each(function () {
                $(this).attr('data-target', '#carousel-cameras-' + link_uuid);
            });

            drone.find('.drone-name-header .btn-primary').css('background-color', color)
            drone.find('.drone-name-header .btn-primary').css('border-color', color)
            drone.css('border-color', color)

            drone.appendTo(drones);

            drone.resizable({
                minHeight: 180,
                minWidth: 320,
                aspectRatio: 16 / 9,
                handles: 'w,s,e'
            }).draggable({
                containment: ".map-container"
            });

            drones_interval[link_uuid] = setInterval(function () {
                // REQUEST_CAPTURE_STATUS
                let _mavlink_mod_commands = get_mavlink_mod_commands(link_uuid)
                if (_mavlink_mod_commands) {
                    _mavlink_mod_commands.mav_send_REQUEST_CAPTURE_STATUS(sysid)
                }

                // Check connection
                if (Date.now() - drones_last_heartbeat[link_uuid] > CONNECTION_LOSS_INTERVAL) {
                    drone.find('.drone-control-toolbar').addClass('connection-lost')
                    drone.find('.drone-control-pfd').addClass('connection-lost')
                }
            }, 1000)
        }

        return drone
    }
})()