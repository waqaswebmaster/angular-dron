var CesiumPublicJS = function () {
    var $drones = $('.drones');

    // Create viewer
    var viewer = cesium_create_viewer('cesiumContainer')

    // Create handler
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Init cesium modules
    var cesium_mod_drone = init_cesium_mod_drone(viewer, dom_selectDrone)

    // Add handler to stop follow
    // handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.WHEEL)
    handler.setInputAction(drone_stopFollow, Cesium.ScreenSpaceEventType.PINCH_START)

    // Select entity
    handler.setInputAction(function (movement) {
        var pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
            var picketObjectName = pickedObject.id.name + ""

            if (picketObjectName.includes("drone")) {
                var link_uuid = viewer.selectedEntity.name.replace(/drone-/g, "");

                cesium_mod_drone.map_selectDrone(link_uuid)
                dom_selectDrone(link_uuid)
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


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
    })

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

    function initCesiumPublic() {
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

    initCesiumPublic();
}
