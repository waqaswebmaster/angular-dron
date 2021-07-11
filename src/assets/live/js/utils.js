function secondsToTime(sec_num, show_hours) {
    if (sec_num < 0) sec_num = 0;

    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours = Math.min(hours, 99);
    minutes = Math.min(minutes, 60)
    seconds = Math.round(Math.min(seconds, 60))

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (hours > 0 || show_hours) return hours + ':' + minutes + ':' + seconds;
    else return minutes + ':' + seconds;
}


function updatePFD(pfd_id, roll, pitch, yaw) {
    var canvas = document.getElementById(pfd_id);
    canvas.width = 50;
    canvas.height = 50;
    var ctx = canvas.getContext("2d");

    var gradient;
    var pfdWidth = 5 * canvas.width;
    var pfdHeight = 5 * canvas.height;

    var degToPx = canvas.height / 60;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(roll * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.translate((canvas.width - pfdWidth) / 2, (canvas.height - pfdHeight) / 2 + pitch * degToPx);

    // Sky
    gradient = ctx.createLinearGradient(0, (pfdHeight - canvas.height) / 2, 0, pfdHeight / 2);
    gradient.addColorStop(0.0, "blue");
    gradient.addColorStop(1.0, "lightsteelblue");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pfdWidth, pfdHeight / 2);

    // Ground
    gradient = ctx.createLinearGradient(0, pfdHeight / 2, 0, (pfdHeight + canvas.height) / 2);
    gradient.addColorStop(0.0, "#fbd050");
    gradient.addColorStop(1.0, "#84681f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, pfdHeight / 2, pfdWidth, pfdHeight);

    // Divider
    ctx.fillStyle = "white"
    ctx.fillRect(0, pfdHeight / 2 - 1, pfdWidth, 2);

    for (var line = -9; line <= 9; line++) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";

        // Main lines
        ctx.beginPath();
        ctx.moveTo(pfdWidth / 2 - canvas.width / 8, line * 10 * degToPx + pfdHeight / 2);
        ctx.lineTo(pfdWidth / 2 + canvas.width / 8, line * 10 * degToPx + pfdHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Semi lines
        ctx.beginPath();
        ctx.moveTo(pfdWidth / 2 - canvas.width / 16, 10 * degToPx * (2 * line - 1) / 2 + pfdHeight / 2);
        ctx.lineTo(pfdWidth / 2 + canvas.width / 16, 10 * degToPx * (2 * line - 1) / 2 + pfdHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Degrees text
        ctx.font = 0.12 * canvas.height + "px sans-serif";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle"
        if (line != 0) {
            ctx.textAlign = "right"
            ctx.fillText(-line * 10, pfdWidth / 2 - canvas.width / 7 - 10, line * 10 * degToPx + pfdHeight / 2);
            ctx.textAlign = "left"
            ctx.fillText(-line * 10, pfdWidth / 2 + canvas.width / 7 + 10, line * 10 * degToPx + pfdHeight / 2);
        }
    }
}


function lteNetworkTypeToText(type) {
    switch (type) {
        case 0:
            return qsTr("No net")
        case 1:
            return "GSM"
        case 2:
            return "GPRS (2.5G)"
        case 3:
            return "EDGE (2.75G)"
        case 4:
            return "WCDMA (3G)"
        case 5:
            return "HSDPA (3G)"
        case 6:
            return "HSUPA (3G)"
        case 7:
            return "HSPA (3G)"
        case 8:
            return "TD-SCDMA (3G)"
        case 9:
            return "HSPA+ (4G)"
        case 10:
            return "EV-DO rev. 0"
        case 11:
            return "EV-DO rev. A"
        case 12:
            return "EV-DO rev. B"
        case 13:
            return "1xRTT"
        case 14:
            return "UMB"
        case 15:
            return "1xEVDV"
        case 16:
            return "3xRTT"
        case 17:
            return "HSPA+ 64QAM"
        case 18:
            return "HSPA+ MIMO"
        case 19:
            return "LTE (4G)"
        case 41:
            return "UMTS (3G)"
        case 44:
            return "HSPA (3G)"
        case 45:
            return "HSPA+ (3G)"
        case 46:
            return "DC-HSPA+ (3G)"
        case 64:
            return "HSPA (3G)"
        case 65:
            return "HSPA+ (3G)"
        case 101:
            return "LTE (4G)"
    }
}


function lteConnectionStatusToText(status) {
    switch (status) {
        case 2:
        case 3:
        case 5:
        case 8:
        case 20:
        case 21:
        case 23:
        case 27:
        case 28:
        case 29:
        case 30:
        case 31:
        case 32:
        case 33:
            return qsTr("Connection failed, the profile is invalid")
        case 7:
        case 11:
        case 14:
        case 37:
            return qsTr("Network access not allowed")
        case 12:
        case 13:
            return qsTr("Connection failed, roaming not allowed")
        case 201:
            return qsTr("Connection failed, bandwidth exceeded")
        case 900:
            return qsTr("Connecting")
        case 901:
            return qsTr("Connected")
        case 902:
            return qsTr("Disconnected")
        case 903:
            return qsTr("Disconnecting")
        case 904:
            return qsTr("Connection failed or disabled")
        default:
            return qsTr("Unknown")
    }
}


function radians_to_degrees(radians) {
    return radians * (180 / Math.PI);
}

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

function get_colors() {
    return [
        "#0d8bf2", "#e6194B", "#3cb44b", "#ffe119", "#f58231",
        "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe",
        "#469990", "#e6beff", "#9A6324", "#fffac8", "#800000",
        "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
        "#ffffff", "#000000"
    ];
}