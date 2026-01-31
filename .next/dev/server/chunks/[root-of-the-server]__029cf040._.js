module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Desktop/menu next - Copy/app/api/proxy/branches/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/proxy/[type]/route.js
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
async function GET(req) {
    const { searchParams } = new URL(req.url);
    const type = req.nextUrl.pathname.split("/").pop();
    try {
        if (type === "branches") {
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw6nvh15toKj3Qt8CRo06JMB8iBOZ37t7Nhcxt73-TY3FGN_8R4b_KzRQYtq828rgPC/exec";
            const res = await fetch(SCRIPT_URL);
            const data = await res.json();
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } else if (type === "location") {
            const lat = searchParams.get("lat");
            const lon = searchParams.get("lon");
            const ua = searchParams.get("ua");
            const ip = searchParams.get("ip");
            const SCRIPT_URL = `https://script.google.com/macros/s/AKfycby_k7_4L7w-F5Dg9w-pRHnVj0FluA1bixYug7iTFm-mS1JcmIm8y7cGrldOR91BszX-/exec?lat=${lat}&lon=${lon}&ua=${encodeURIComponent(ua)}&ip=${ip}`;
            const res = await fetch(SCRIPT_URL);
            const text = await res.text();
            return new Response(text, {
                status: 200,
                headers: {
                    "Content-Type": "text/plain"
                }
            });
        } else {
            return new Response(JSON.stringify({
                error: "Unknown proxy type"
            }), {
                status: 400
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({
            error: err.message
        }), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__029cf040._.js.map