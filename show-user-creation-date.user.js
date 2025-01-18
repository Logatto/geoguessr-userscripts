// ==UserScript==
// @name         Show Geoguessr user creation
// @version      1.0.0
// @description  Show the creation date of an user in the geoguessr profile's user.
// @author       Logatto
// @match        https://www.geoguessr.com/user/*
// @grant        none
// @downloadURL  https://github.com/Logatto/geoguessr-userscripts/raw/main/show-user-creation-date.user.js
// @updateURL    https://github.com/Logatto/geoguessr-userscripts/raw/main/show-user-creation-date.user.js
// ==/UserScript==

(function () {
    'use strict';

    const processUserProfile = () => {
        const currentURL = window.location.href;
        const userID = currentURL.split("/user/")[1];
        if (userID) {
            const timestampHex = userID.substring(0, 8);
            const timestamp = parseInt(timestampHex, 16);
            const creationDate = new Date(timestamp * 1000);
            const formattedDate = creationDate.toUTCString();

            const profileHeader = document.querySelector('[class^="profile-header_header"]');
            if (profileHeader && !profileHeader.nextSibling?.textContent?.includes("User Created at")) {
                const siblingElement = document.createElement('div');
                siblingElement.textContent = `User Created at: ${formattedDate}`;
                siblingElement.style.marginTop = '10px';
                siblingElement.style.fontSize = '16px';

                profileHeader.parentNode.insertBefore(siblingElement, profileHeader.nextSibling);
            }
        }
    };

    const observeDOMChanges = () => {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0) {
                        const currentURL = window.location.href;
                        if (currentURL.includes("/user/")) {
                            processUserProfile();
                        }
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    };

    processUserProfile();
    observeDOMChanges();
})();
