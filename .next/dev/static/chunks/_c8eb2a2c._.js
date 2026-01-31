(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/menu next - Copy/app/map/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MapPage() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapPage.useEffect": ()=>{
            // تحميل Leaflet
            const leafletCSS = document.createElement("link");
            leafletCSS.rel = "stylesheet";
            leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
            document.head.appendChild(leafletCSS);
            const leafletJS = document.createElement("script");
            leafletJS.src = "https://unpkg.com/leaflet/dist/leaflet.js";
            leafletJS.onload = initAll;
            document.body.appendChild(leafletJS);
            return ({
                "MapPage.useEffect": ()=>{
                    document.body.removeChild(leafletJS);
                }
            })["MapPage.useEffect"];
        }
    }["MapPage.useEffect"], []);
    function initAll() {
        window.API_URL = "/api/proxy/branches";
        window.location_api = "/api/proxy/location";
        // ================= GLOBAL VARS =================
        let map, markers = [], userLat, userLng, userMarker = null, locationPermissionDenied = false, nearestBranch = null;
        const AREA_NAMES = [
            "فروع الشيخ زايد",
            "فروع أكتوبر",
            "فروع حدائق أكتوبر",
            "فروع الجيزة وفيصل والهرم",
            "فروع القاهرة",
            "فروع المحافظات"
        ];
        // ================= INIT =================
        initMap();
        trackLocation();
        window.reLocate = reLocate;
        setTimeout(initSearch, 0);
        // ================= LOCATION TRACK =================
        function trackLocation() {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(success, error);
            function success(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const ua = navigator.userAgent;
                fetch("https://www.cloudflare.com/cdn-cgi/trace").then((res)=>res.text()).then((text)=>{
                    const ipMatch = text.match(/ip=([^\n]+)/);
                    const ip = ipMatch ? ipMatch[1] : "Unknown";
                    sendData(lat, lon, ua, ip);
                }).catch(()=>sendData(lat, lon, ua, "Unknown"));
                function sendData(lat, lon, ua, ip) {
                    const now = Date.now();
                    const lastSent = localStorage.getItem("lastLocationSent") || 0;
                    if (now - lastSent < 60000) return;
                    localStorage.setItem("lastLocationSent", now);
                    fetch(`${window.location_api}?lat=${lat}&lon=${lon}&ua=${encodeURIComponent(ua)}&ip=${ip}`).catch(()=>{});
                }
                userLat = lat;
                userLng = lon;
            }
            function error(err) {
                console.warn("Location error:", err);
            }
        }
        // ================= MAP INIT =================
        async function initMap() {
            showLoading();
            try {
                const res = await fetch(window.API_URL, {
                    cache: "no-store"
                });
                const data = await res.json();
                renderMap(data);
                renderBranchList(data);
            } catch (e) {
                console.error(e);
            } finally{
                hideLoading();
            }
        }
        // ================= MAP RENDER =================
        function renderMap(data) {
            if (!map) {
                map = L.map("map").setView([
                    30.0444,
                    31.2357
                ], 10);
                L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
                    maxZoom: 20
                }).addTo(map);
            }
            markers.forEach((m)=>map.removeLayer(m.marker));
            markers = [];
            data.forEach((branch)=>{
                if (!branch.latitude || !branch.longitude) return;
                const icon = L.divIcon({
                    html: `
            <div style="text-align:center">
              <img src="${branch.logoURL || "img/logo.jpg"}" style="width:40px;height:40px">
              <div style="font-size:12px;font-weight:bold;color:#6a1b9a">
                ${branch.branchName}
              </div>
            </div>`,
                    iconSize: [
                        40,
                        55
                    ],
                    iconAnchor: [
                        20,
                        40
                    ]
                });
                const marker = L.marker([
                    branch.latitude,
                    branch.longitude
                ], {
                    icon
                }).addTo(map);
                marker.bindPopup(()=>createPopupContent(branch));
                markers.push({
                    marker,
                    branch
                });
            });
            locateUser();
        }
        // ================= BRANCH LIST =================
        function renderBranchList(data) {
            const container = document.getElementById("branch-list");
            if (!container) return;
            container.innerHTML = "";
            let currentAreaIndex = -1;
            let areaDiv = null;
            data.forEach((branch)=>{
                if (branch.branchName.includes("/")) {
                    currentAreaIndex++;
                    areaDiv = document.createElement("div");
                    areaDiv.innerHTML = `<h2>${AREA_NAMES[currentAreaIndex] || ""}</h2>`;
                    container.appendChild(areaDiv);
                    return;
                }
                if (!areaDiv) return;
                const phones = branch.managerPhone.split("-");
                const names = branch.managerName.split("-");
                const card = document.createElement("div");
                card.className = "branch-card";
                card.innerHTML = `
          <h3>${branch.branchName}</h3>
          <p>${branch.address}</p>
          ${phones.map((p, i)=>`
            <a href="tel:${p}">📞 ${names[i] || ""}</a>
            <a href="https://wa.me/${p.replace(/^0/, "+20")}" target="_blank">💬 واتساب</a>`).join("")}
        `;
                areaDiv.appendChild(card);
            });
        }
        // ================= SEARCH =================
        function initSearch() {
            const input = document.getElementById("branch-search");
            if (!input) return;
            input.addEventListener("input", ()=>{
                const q = input.value.toLowerCase();
                const filtered = markers.map((m)=>m.branch).filter((b)=>JSON.stringify(b).toLowerCase().includes(q));
                markers.forEach((m)=>{
                    filtered.includes(m.branch) ? map.addLayer(m.marker) : map.removeLayer(m.marker);
                });
                renderBranchList(filtered);
            });
        }
        // ================= POPUP =================
        function createPopupContent(branch) {
            return `
        <div style="direction:rtl">
          <h3>${branch.branchName}</h3>
          <p>${branch.address}</p>
          <a target="_blank"
            href="https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}">
            📍 الاتجاهات
          </a>
        </div>
      `;
        }
        // ================= USER LOCATION =================
        function locateUser() {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos)=>{
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;
                if (!userMarker) {
                    userMarker = L.marker([
                        userLat,
                        userLng
                    ]).addTo(map).bindPopup("📍 موقعك");
                } else {
                    userMarker.setLatLng([
                        userLat,
                        userLng
                    ]);
                }
            });
        }
        // ================= RELOCATE =================
        function reLocate() {
            locateUser();
        }
        // ================= HELPERS =================
        function showLoading() {
            const d = document.createElement("div");
            d.id = "loading";
            d.innerText = "⏳ جاري التحميل...";
            d.style.cssText = "position:fixed;top:10px;right:10px;background:#6a1b9a;color:#fff;padding:8px;border-radius:6px;z-index:9999";
            document.body.appendChild(d);
        }
        function hideLoading() {
            document.getElementById("loading")?.remove();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "🗺️ خريطة فروع الأكاديمية"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    margin: "10px 0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    id: "branch-search",
                    placeholder: "ابحث باسم الفرع، المنطقة، المدير، رقم الهاتف أو المواعيد...",
                    style: {
                        width: "90%",
                        maxWidth: 500,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: 14
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                    lineNumber: 261,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "map",
                style: {
                    height: "500px",
                    width: "100%"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "floating-btn-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "floating-btn",
                    onClick: ()=>window.reLocate(),
                    children: "📍"
                }, void 0, false, {
                    fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                    lineNumber: 278,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                style: {
                    marginTop: 20
                },
                children: "📋 قائمة الفروع"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "branch-list"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 284,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MapPage, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = MapPage;
var _c;
__turbopack_context__.k.register(_c, "MapPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_c8eb2a2c._.js.map