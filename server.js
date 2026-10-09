import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectDir = path.dirname(fileURLToPath(import.meta.url));
try {
  const envText = await readFile(path.join(projectDir, ".env"), "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const distDir = path.join(projectDir, "dist");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};
const allowedModes = new Set(["DRIVE", "TRANSIT", "WALK", "BICYCLE", "TWO_WHEELER"]);
const fields = [
  "routes.duration",
  "routes.distanceMeters",
  "routes.polyline.encodedPolyline",
  "routes.legs.startLocation",
  "routes.legs.endLocation",
  "routes.legs.steps.staticDuration",
  "routes.legs.steps.travelMode",
  "routes.legs.steps.transitDetails",
  "routes.travelAdvisory.transitFare",
  "routes.localizedValues.transitFare",
].join(",");

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

async function serveFrontend(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const url = new URL(request.url, "http://localhost");
  let filePath = path.resolve(distDir, `.${decodeURIComponent(url.pathname)}`);
  if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  let contents;
  try {
    contents = await readFile(filePath);
  } catch {
    filePath = path.join(distDir, "index.html");
    try {
      contents = await readFile(filePath);
    } catch {
      sendJson(response, 503, { error: "The frontend build is missing. Run npm run build before starting the server." });
      return;
    }
  }

  response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
  response.end(request.method === "HEAD" ? undefined : contents);
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 20000) throw new Error("Request is too large.");
  }
  return JSON.parse(body || "{}");
}

const server = http.createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/api/routes") {
    if (!request.url.startsWith("/api/")) {
      await serveFrontend(request, response);
    } else {
      sendJson(response, 404, { error: "Not found" });
    }
    return;
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    sendJson(response, 503, { error: "Add GOOGLE_MAPS_API_KEY to the project .env file to enable live routes." });
    return;
  }

  try {
    const input = await readJson(request);
    const origin = String(input.origin || "").trim();
    const destination = String(input.destination || "").trim();
    const mode = String(input.mode || "TRANSIT").toUpperCase();
    if (!origin || !destination || origin.length > 300 || destination.length > 300) {
      sendJson(response, 400, { error: "Enter a starting point and destination (up to 300 characters each)." });
      return;
    }
    if (!allowedModes.has(mode)) {
      sendJson(response, 400, { error: "That travel mode is not supported." });
      return;
    }

    const googleRequest = {
      origin: { address: origin },
      destination: { address: destination },
      travelMode: mode,
      computeAlternativeRoutes: true,
      languageCode: input.language === "hi" ? "hi" : "en",
      regionCode: "IN",
    };
    if (mode === "DRIVE") googleRequest.routingPreference = "TRAFFIC_AWARE";
    if (mode === "TRANSIT" && ["walking", "transfers"].includes(input.preference)) {
      googleRequest.transitPreferences = {
        routingPreference: input.preference === "walking" ? "LESS_WALKING" : "FEWER_TRANSFERS",
      };
    }

    const googleResponse = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": fields,
      },
      body: JSON.stringify(googleRequest),
    });
    const data = await googleResponse.json();
    if (!googleResponse.ok) {
      const message = data.error?.message || "Google Routes could not calculate this journey.";
      sendJson(response, googleResponse.status, { error: message });
      return;
    }
    sendJson(response, 200, data);
  } catch (error) {
    sendJson(response, 400, { error: error.message || "Could not read the route request." });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`SmartRoute listening on port ${port}`);
});
