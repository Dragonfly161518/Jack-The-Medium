// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "jack-it") {
    if (!tab) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        const { url } = activeTab;
        createIncognito(url);
      });
    } else {
      const { url } = tab;
      createIncognito(url);
    }
  }

  const createIncognito = (newTabUrl) => {
    const getInfo = {
      populate: true,
    };
    chrome.windows.getAll(getInfo, (windows) => {
      console.log(windows);
      windows = windows.filter((window) => window.incognito);
      console.log(windows);
      if (windows.length > 0) {
        const windowId = windows[0].id;
        const createProperties = {
          windowId,
          url: newTabUrl,
          active: true,
        };
        chrome.tabs.create(createProperties, (tab) => {
          console.log("create new " + tab.url + " tab in window: " + windowId);
        });
      } else {
        const createData = {
          url: newTabUrl,
          incognito: true,
          focused: true,
        };
        chrome.windows.create(createData, (window) => {
          console.log("create new window with " + newTabUrl + " tab");
        });
      }
    });
  };
});
