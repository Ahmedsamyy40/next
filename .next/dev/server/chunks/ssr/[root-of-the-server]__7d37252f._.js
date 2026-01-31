module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Desktop/menu next - Copy/app/map/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function MapPage() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // تحميل Leaflet
        const leafletCSS = document.createElement("link");
        leafletCSS.rel = "stylesheet";
        leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
        document.head.appendChild(leafletCSS);
        const leafletJS = document.createElement("script");
        leafletJS.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        leafletJS.onload = initAll;
        document.body.appendChild(leafletJS);
        return ()=>{
            document.body.removeChild(leafletJS);
        };
    }, []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "🗺️ خريطة فروع الأكاديمية"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    margin: "10px 0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "floating-btn-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                style: {
                    marginTop: 20
                },
                children: "📋 قائمة الفروع"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "branch-list"
            }, void 0, false, {
                fileName: "[project]/Desktop/menu next - Copy/app/map/page.jsx",
                lineNumber: 284,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7d37252f._.js.map