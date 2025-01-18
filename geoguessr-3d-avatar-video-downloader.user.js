// ==UserScript==
// @name         Geoguessr 3D Avatar Video Downloader
// @version      1.0.0
// @description  Start record with Ctrl+C and stop the recording with Ctrl+Q.
// @author       Logatto
// @match        https://www.geoguessr.com/*
// @grant        none
// @require      https://www.webrtc-experiment.com/RecordRTC.js
// ==/UserScript==

(function () {
    "use strict";

    let recorder = null;
    let capturing = false;
    let canvas = null;
    let stream = null;

    const waitForCanvas = setInterval(() => {
        canvas = document.querySelector("canvas");
        if (canvas) {
            clearInterval(waitForCanvas);
            console.log("Canvas encontrado:", canvas);

            stream = canvas.captureStream(60);

            document.addEventListener("keydown", (event) => {
                if (event.ctrlKey && event.key === "c" && !capturing) {
                    console.log("Captura iniciada con Ctrl + C");
                    startRecording();
                }

                if (event.ctrlKey && event.key === "q" && capturing) {
                    console.log("Captura detenida con Ctrl + Q");
                    stopRecording();
                }
            });
        }
    }, 1000);

    function startRecording() {
        recorder = new RecordRTC(stream, {
            type: "video",
            mimeType: "video/webm;codecs=vp9",
            bitsPerSecond: 5000000,
        });
        capturing = true;

        recorder.startRecording();
        console.log("Grabación iniciada.");
    }

    function stopRecording() {
        if (recorder && capturing) {
            recorder.stopRecording(function () {
                const blob = recorder.getBlob();
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = "canvas_recording.webm";
                link.click();
                console.log("Grabación detenida y guardada.");
            });
            capturing = false;
        }
    }
})();
