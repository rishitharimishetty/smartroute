
import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";


const translations = {
  hi: {
    "India · Live routes": "भारत · लाइव रास्ते",
    "Explore routes": "रास्ते देखें",
    About: "हमारे बारे में",
    Language: "भाषा",
    "CALCULATED ROUTES": "गणना किए गए रास्ते",
    "LIVE MAP PREVIEW": "लाइव नक्शा",
    "Public transit option 1": "सार्वजनिक परिवहन विकल्प 1",
    "Public transit option 2": "सार्वजनिक परिवहन विकल्प 2",
    "Public transit option 3": "सार्वजनिक परिवहन विकल्प 3",
    "Driving option 1": "कार विकल्प 1",
    "Driving option 2": "कार विकल्प 2",
    "Driving option 3": "कार विकल्प 3",
    "Walking option 1": "पैदल विकल्प 1",
    "Walking option 2": "पैदल विकल्प 2",
    "Walking option 3": "पैदल विकल्प 3",
    "Bicycle option 1": "साइकिल विकल्प 1",
    "Bicycle option 2": "साइकिल विकल्प 2",
    "Bicycle option 3": "साइकिल विकल्प 3",
    "Two-wheeler option 1": "दोपहिया विकल्प 1",
    "Two-wheeler option 2": "दोपहिया विकल्प 2",
    "Two-wheeler option 3": "दोपहिया विकल्प 3",
    "PLAN YOUR JOURNEY": "अपनी यात्रा की योजना बनाएं",
    "Where are you headed?": "आप कहाँ जाना चाहते हैं?",
    "Tell us where you're going. We'll help you compare your options.": "अपनी मंज़िल बताएं और यात्रा के विकल्पों की तुलना करें।",
    FROM: "यहाँ से",
    TO: "यहाँ तक",
    "YOUR PRIORITY": "आपकी प्राथमिकता",
    "TRAVEL MODE": "यात्रा का साधन",
    Balanced: "संतुलित",
    Fastest: "सबसे तेज़",
    "Lowest fare": "सबसे कम किराया",
    "Less walking": "कम पैदल चलना",
    "Fewer transfers": "कम बदलाव",
    "Public transit": "सार्वजनिक परिवहन",
    Driving: "कार",
    Walking: "पैदल",
    Bicycle: "साइकिल",
    "Two-wheeler": "दोपहिया",
    "Compare routes": "रास्तों की तुलना करें",
    "Finding routes…": "रास्ते खोज रहे हैं…",
    "YOUR OPTIONS": "आपके विकल्प",
    "Your route comparison": "आपकी यात्रा के विकल्प",
    "Choose your journey": "अपनी यात्रा चुनें",
    "Three ways to get there. You decide what matters most.": "यात्रा के विकल्पों में से अपनी प्राथमिकता चुनें।",
    OPTIONS: "विकल्प",
    "TRAVEL TIME": "यात्रा का समय",
    "EST. FARE": "अनुमानित किराया",
    "ROUTE DISTANCE": "रास्ते की दूरी",
    WALKING: "पैदल",
    "JOURNEY BREAKDOWN": "यात्रा का विवरण",
    "BEST MATCH": "सबसे उपयुक्त",
    "TOP MATCH": "शीर्ष विकल्प",
    "Selected route ✓": "चुना गया ✓",
    "Select this route": "यह रास्ता चुनें",
    "Your journey, visualised": "आपकी यात्रा का नक्शा",
    "No fare data": "किराये की जानकारी नहीं",
    "No walking segments": "पैदल चलने का हिस्सा नहीं",
    "Live routes by Google Maps. Travel times reflect available route data and may change with traffic or transit schedules.": "Google Maps के लाइव रास्ते। समय ट्रैफ़िक और परिवहन समय-सारणी के अनुसार बदल सकता है।",
    "Choose a travel mode and compare live routes.": "यात्रा का साधन चुनें और लाइव रास्तों की तुलना करें।",
    "Route geometry and directions from Google Maps.": "Google Maps से रास्ते और दिशा-निर्देश।",
    "Jaipur preview — compare a journey to calculate live routes.": "जयपुर का पूर्वावलोकन — लाइव रास्ते देखने के लिए यात्रा की तुलना करें।",
    "Route data unavailable for this trip. Try another mode or nearby locations.": "इस यात्रा के लिए रास्ते की जानकारी उपलब्ध नहीं है। दूसरा साधन या नज़दीकी स्थान आज़माएँ।",
    "No planned transport transfers": "परिवहन बदलने की ज़रूरत नहीं",
    "planned transport transfer": "परिवहन बदलाव",
    "planned transport transfers": "परिवहन बदलाव",
    Sample: "नमूना",
    "Sample journey · transfer details appear after search": "नमूना यात्रा · खोज के बाद बदलाव दिखेंगे",
    "Initial cards are illustrative examples; search to load current route data.": "शुरुआती कार्ड उदाहरण हैं; लाइव डेटा के लिए खोजें।",
    "Save time": "समय बचाएं",
    "Compare travel times": "यात्रा के समय की तुलना करें",
    "Save money": "पैसे बचाएं",
    "Compare estimated fares": "अनुमानित किराये की तुलना करें",
    "Travel smarter": "समझदारी से यात्रा करें",
    "Choose your priorities": "अपनी प्राथमिकताएँ चुनें",
    "Every journey,": "हर यात्रा,",
    "a smarter choice.": "एक बेहतर चुनाव।",
    "Compare routes, save time, and find a journey that works for you.": "रास्तों की तुलना करें, समय बचाएं और अपने लिए सही यात्रा चुनें।",
    "Reach your destination sooner": "मंज़िल पर जल्दी पहुँचें",
    "Spend less on your journey": "यात्रा पर कम खर्च करें",
    "A shorter walking distance": "कम पैदल चलें",
    "Jaipur demo": "जयपुर डेमो",
    "YOUR CITY, CONNECTED": "आपका शहर, जुड़ा हुआ",
    "SMARTER URBAN MOBILITY": "बेहतर शहरी यात्रा",
    "Starting location": "शुरुआती स्थान",
    Destination: "मंज़िल",
    "01 / PLAN": "01 / योजना",
    "Road route": "सड़क मार्ग",
    Walk: "पैदल",
    Bus: "बस",
    Metro: "मेट्रो",
    "Road route geometry from OpenStreetMap routing data.": "OpenStreetMap से सड़क मार्ग का नक्शा।",
    "Jaipur preview — compare a journey to calculate a real road route.": "जयपुर का पूर्वावलोकन — लाइव रास्ता देखने के लिए यात्रा की तुलना करें।",
    "Better journeys start with better choices.": "बेहतर चुनाव से बेहतर यात्रा शुरू होती है।",
    "Compare the trade-offs between time, estimated cost and walking before choosing your preferred route.": "यात्रा चुनने से पहले समय, अनुमानित लागत और पैदल दूरी की तुलना करें।",
    "Urban travel, made simpler.": "शहरी यात्रा को आसान बनाएं।",
    "Time-aware": "समय के अनुसार",
    "Budget-conscious": "बजट के अनुसार",
    "Walking-aware": "पैदल दूरी के अनुसार",
    "ABOUT SMARTROUTE AI": "SMARTROUTE AI के बारे में",
    "Hackathon prototype · Jaipur demo": "हैकाथॉन प्रोटोटाइप · जयपुर डेमो",
    "Back to top ↑": "ऊपर जाएं ↑",
  },
};

const translationsFor = (language) => translations[language] || {};

const demoRoutes = [
  {
    id: 1,
    name: "Fastest route",
    description: "Reach your destination sooner",
    time: 32,
    fare: 50,
    walk: 8,
    transfers: 0,
    modes: ["Walk", "Metro", "Walk"],
    icon: "⚡",
  },
  {
    id: 2,
    name: "Budget friendly",
    description: "Spend less on your journey",
    time: 48,
    fare: 35,
    walk: 12,
    transfers: 1,
    modes: ["Walk", "Bus", "Metro", "Walk"],
    icon: "₹",
  },
  {
    id: 3,
    name: "Less walking",
    description: "A shorter walking distance",
    time: 42,
    fare: 42,
    walk: 5,
    transfers: 1,
    modes: ["Walk", "Bus", "Metro"],
    icon: "🚶",
  },
];

function App() {
  const [start, setStart] = useState("Hawa Mahal");
  const [destination, setDestination] = useState(
    "Jaipur Railway Station"
  );
  const [preference, setPreference] = useState("balanced");
  const [searched, setSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(1);
  const [liveRoutes, setLiveRoutes] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeEndpoints, setRouteEndpoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [travelMode, setTravelMode] = useState("TRANSIT");
  const [language, setLanguage] = useState("en");
  const t = (text) => translationsFor(language)[text] || text;

  const sortedRoutes = useMemo(() => {
    const list = [...(liveRoutes || demoRoutes)];

    if (preference === "fastest") {
      list.sort((a, b) => a.time - b.time);
    } else if (preference === "cheapest") {
      list.sort((a, b) => (a.fareValue ?? Infinity) - (b.fareValue ?? Infinity));
    } else if (preference === "walking") {
      list.sort((a, b) => (a.walk ?? Infinity) - (b.walk ?? Infinity));
    } else if (preference === "transfers") {
      list.sort((a, b) => a.transfers - b.transfers);
    } else {
      list.sort((a, b) => a.time + a.transfers * 8 + (a.walk || 0) * 0.2 - (b.time + b.transfers * 8 + (b.walk || 0) * 0.2));
    }

    return list;
  }, [preference, liveRoutes]);

  function handleSearch(event) {
    event.preventDefault();

    if (!start.trim() || !destination.trim()) {
      return;
    }

    findRoutes(start.trim(), destination.trim());
  }

  function swapLocations() {
    setStart(destination);
    setDestination(start);
    setSearched(false);
    setLiveRoutes(null);
    setRouteGeometry(null);
    setRouteEndpoints(null);
    setError("");
  }

  async function findRoutes(origin, target) {
    setLoading(true);
    setError("");
    try {
      let response;
      try {
        response = await fetch("/api/routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin, destination: target, mode: travelMode, language, preference }),
        });
      } catch {
        throw new Error("The route server is not responding. Start `npm run api` in a second VS Code terminal.");
      }
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The route server returned an unreadable response. Start `npm run api` in a second VS Code terminal. Google routes also need a key in the project .env file.");
      }
      if (!response.ok) {
        const message = data.error || "Google Routes could not calculate this journey.";
        if (message.toLowerCase().includes("http proxy error") || message.toLowerCase().includes("econnrefused")) {
          throw new Error("The route server is not responding. Start `npm run api` in a second VS Code terminal.");
        }
        throw new Error(message);
      }
      if (!data.routes?.length) throw new Error("Route data unavailable for this trip. Try another mode or nearby locations.");

      const decodePolyline = (encoded) => {
        const points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;
        while (index < encoded.length) {
          let result = 0;
          let shift = 0;
          let byte;
          do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
          lat += result & 1 ? ~(result >> 1) : result >> 1;
          result = 0;
          shift = 0;
          do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
          lng += result & 1 ? ~(result >> 1) : result >> 1;
          points.push([lat / 1e5, lng / 1e5]);
        }
        return points;
      };
      const seconds = (value = "0s") => Number.parseInt(value, 10) || 0;
      const modeLabel = t({ TRANSIT: "Public transit", DRIVE: "Driving", WALK: "Walking", BICYCLE: "Bicycle", TWO_WHEELER: "Two-wheeler" }[travelMode]);
      const generated = data.routes.map((route, index) => {
        const legs = route.legs || [];
        const steps = legs.flatMap((leg) => leg.steps || []);
        const transitSteps = steps.filter((step) => step.transitDetails);
        const walkingSeconds = steps.filter((step) => step.travelMode === "WALK").reduce((sum, step) => sum + seconds(step.staticDuration), 0);
        const fare = route.localizedValues?.transitFare?.text || null;
        const fareData = route.travelAdvisory?.transitFare;
        const fareValue = fareData ? Number(fareData.units || 0) + Number(fareData.nanos || 0) / 1e9 : null;
        const modes = [];
        for (const step of steps) {
          const transit = step.transitDetails;
          if (transit) {
            const line = transit.transitLine;
            const kind = line?.vehicle?.name?.text || "Transit";
            const lineName = line?.nameShort || line?.name;
            const fromStop = transit.stopDetails?.departureStop?.name;
            const toStop = transit.stopDetails?.arrivalStop?.name;
            const stops = fromStop && toStop ? `: ${fromStop} → ${toStop}` : "";
            modes.push(`${kind}${lineName ? ` ${lineName}` : ""}${stops}`);
          } else if (step.travelMode === "WALK" && !modes.includes("Walk")) {
            modes.push("Walk");
          }
        }
        const firstLocation = legs[0]?.startLocation?.latLng;
        const lastLeg = legs[legs.length - 1];
        const lastLocation = lastLeg?.endLocation?.latLng;
        return {
          id: index + 1,
          name: `${modeLabel} option ${index + 1}`,
          description: `${(route.distanceMeters / 1000).toFixed(1)} km · ${modeLabel.toLowerCase()}`,
          time: Math.max(1, Math.round(seconds(route.duration) / 60)),
          distance: route.distanceMeters,
          fare,
          fareValue,
          walk: travelMode === "TRANSIT" ? Math.round(walkingSeconds / 60) : null,
          transfers: Math.max(0, transitSteps.length - 1),
          modes: modes.length ? modes : [modeLabel],
          icon: ["✦", "↗", "◎"][index % 3],
          coordinates: decodePolyline(route.polyline?.encodedPolyline || ""),
          color: ["#58d6a4", "#8f82ff", "#65b8f2"][index % 3],
          endpoints: firstLocation && lastLocation ? {
            from: [firstLocation.latitude, firstLocation.longitude],
            to: [lastLocation.latitude, lastLocation.longitude],
          } : null,
        };
      });
      const validRoutes = generated.filter((route) => route.coordinates.length > 0);
      if (!validRoutes.length) throw new Error("The route service returned no map geometry. Please try again.");
      setLiveRoutes(validRoutes);
      setRouteGeometry(validRoutes.map(({ coordinates, color }) => ({ coordinates, color })));
      setRouteEndpoints(validRoutes[0].endpoints);
      setSelectedRoute(validRoutes[0].id);
      setSearched(true);
    } catch (lookupError) {
      setError(lookupError.message || "Couldn't calculate routes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">S</span>
          <span>
            <strong>SmartRoute<span className="brand-ai"> AI</span></strong>
            <small>YOUR CITY, CONNECTED</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#routes">{t("Explore routes")}</a>
          <a href="#about">{t("About")}</a>
          <label className="language-control"><span className="sr-only">{t("Language")}</span><select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en">EN</option><option value="hi">हिंदी</option></select></label>
          <span className="demo-pill">
            <span className="status-dot" />
            {t("India · Live routes")}
          </span>
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              SMARTER URBAN MOBILITY
            </div>

            <h1>
              {t("Every journey,")}
              <br />
              <span>{t("a smarter choice.")}</span>
            </h1>

            <p className="hero-description">
              {t("Compare routes, save time, and find a journey that works for you.")}
            </p>

            <div className="hero-stats">
              <div>
                <span className="stat-icon">◷</span>
                <span><strong>{t("Save time")}</strong><small>Compare travel times</small></span>
              </div>
              <div>
                <span className="stat-icon">₹</span>
                <span><strong>{t("Save money")}</strong><small>Compare estimated fares</small></span>
              </div>
              <div>
                <span className="stat-icon">↗</span>
                <span><strong>{t("Travel smarter")}</strong><small>Choose your priorities</small></span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of a city route">
            <div className="visual-glow" />
            <div className="map-grid" />
            <div className="map-route route-one" />
            <div className="map-route route-two" />
            <div className="map-pin pin-start">A</div>
            <div className="map-pin pin-end">B</div>
            <div className="map-card">
              <span className="map-card-icon">✦</span>
              <div>
                <strong>Your city. Your route.</strong>
                <small>Find a better way to get there.</small>
              </div>
            </div>
            <div className="map-label label-one">START</div>
            <div className="map-label label-two">DESTINATION</div>
          </div>
        </section>

        <section className="search-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t("PLAN YOUR JOURNEY")}</span>
              <h2>{t("Where are you headed?")}</h2>
              <p>{t("Tell us where you're going. We'll help you compare your options.")}</p>
            </div>
            <span className="step-label">01 / PLAN</span>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="location-field">
              <label htmlFor="start">{t("FROM")}</label>
              <div className="input-wrap">
                <span className="field-dot start-dot" />
                <input
                  id="start"
                  value={start}
                  onChange={(event) => { setStart(event.target.value); setSearched(false); setLiveRoutes(null); setRouteGeometry(null); setRouteEndpoints(null); }}
                  placeholder={language === "hi" ? "शुरुआती स्थान" : "Starting location"}
                  required
                />
              </div>
            </div>

            <button
              className="swap-button"
              type="button"
              onClick={swapLocations}
              aria-label="Swap starting point and destination"
              title="Swap locations"
            >
              ⇄
            </button>

            <div className="location-field">
              <label htmlFor="destination">{t("TO")}</label>
              <div className="input-wrap">
                <span className="field-dot end-dot" />
                <input
                  id="destination"
                  value={destination}
                  onChange={(event) => { setDestination(event.target.value); setSearched(false); setLiveRoutes(null); setRouteGeometry(null); setRouteEndpoints(null); }}
                  placeholder={language === "hi" ? "मंज़िल" : "Destination"}
                  required
                />
              </div>
            </div>

            <div className="preference-field">
              <label htmlFor="travelMode">{t("TRAVEL MODE")}</label>
              <select
                id="travelMode"
                value={travelMode}
                onChange={(event) => { setTravelMode(event.target.value); setSearched(false); setLiveRoutes(null); setRouteGeometry(null); setRouteEndpoints(null); }}
              >
                <option value="TRANSIT">{t("Public transit")}</option>
                <option value="DRIVE">{t("Driving")}</option>
                <option value="WALK">{t("Walking")}</option>
                <option value="BICYCLE">{t("Bicycle")}</option>
                <option value="TWO_WHEELER">{t("Two-wheeler")}</option>
              </select>
            </div>

            <div className="preference-field">
              <label htmlFor="preference">{t("YOUR PRIORITY")}</label>
              <select
                id="preference"
                value={preference}
                onChange={(event) => setPreference(event.target.value)}
              >
                <option value="balanced">{t("Balanced")}</option>
                <option value="fastest">{t("Fastest")}</option>
                <option value="cheapest">{t("Lowest fare")}</option>
                <option value="walking">{t("Less walking")}</option>
                <option value="transfers">{t("Fewer transfers")}</option>
              </select>
            </div>

            <button className="search-button" type="submit" disabled={loading}>
              {loading ? t("Finding routes…") : t("Compare routes")} <span>{loading ? "…" : "→"}</span>
            </button>
          </form>

          <p className={`demo-notice ${error ? "route-error" : ""}`} role={error ? "alert" : "status"}>
            <span>{error ? "!" : "ⓘ"}</span> {error || (liveRoutes
              ? t("Live routes by Google Maps. Travel times reflect available route data and may change with traffic or transit schedules.")
              : `${t("Choose a travel mode and compare live routes.")} ${t("Initial cards are illustrative examples; search to load current route data.")}`)}
          </p>
        </section>

        <section className="routes-section" id="routes">
          <div className="routes-heading">
            <div>
              <span className="section-kicker">{t("YOUR OPTIONS")}</span>
              <h2>{searched ? t("Your route comparison") : t("Choose your journey")}</h2>
              <p>
                {searched
                  ? `${start.trim()} → ${destination.trim()}`
                  : t("Three ways to get there. You decide what matters most.")}
              </p>
            </div>
            <span className="results-count">{String(sortedRoutes.length).padStart(2, "0")} OPTIONS</span>
          </div>

          <div className="route-grid">
            {sortedRoutes.map((route, index) => (
              <article
                className={`route-card ${
                  selectedRoute === route.id ? "route-selected" : ""
                }`}
                key={route.id}
              >
                <div className="route-card-top">
                  <span className="route-icon">{route.icon}</span>
                  {index === 0 && (
                    <span className="recommended-badge">
                      {t(preference === "balanced" ? "BEST MATCH" : "TOP MATCH")}
                    </span>
                  )}
                </div>

                <h3>{t(route.name)}</h3>
                <p className="route-description">{t(route.description)}</p>

                <div className="route-metrics">
                  <div>
                    <span className="metric-label">{t("TRAVEL TIME")}</span>
                    <strong>{route.time}<small> min</small></strong>
                  </div>
                  <div>
                    <span className="metric-label">{travelMode === "TRANSIT" ? t("EST. FARE") : t("ROUTE DISTANCE")}</span>
                    <strong>{travelMode === "TRANSIT" ? (liveRoutes ? (route.fare || t("No fare data")) : `${t("Sample")} ₹${route.fare}`) : (route.distance ? `${(route.distance / 1000).toFixed(1)} km` : "—")}</strong>
                  </div>
                  {travelMode === "TRANSIT" && <div>
                    <span className="metric-label">{t("WALKING")}</span>
                    <strong>{liveRoutes ? (route.walk > 0 ? <>{route.walk}<small> min</small></> : t("No walking segments")) : `${t("Sample")} ${route.walk} min`}</strong>
                  </div>}
                </div>

                <div className="route-divider" />

                <div className="journey-label">{t("JOURNEY BREAKDOWN")}</div>
                <div className="transport-modes">
                  {route.modes.map((mode, modeIndex) => (
                    <span className="mode-group" key={`${route.id}-${modeIndex}`}>
                      {modeIndex > 0 && <span className="mode-arrow">→</span>}
                      <span className="mode-chip">{t(mode)}</span>
                    </span>
                  ))}
                </div>

                <div className="transfer-note">
                  <span>↗</span>
                  {liveRoutes
                    ? (route.transfers === 0 ? t("No planned transport transfers") : `${route.transfers} ${t(route.transfers === 1 ? "planned transport transfer" : "planned transport transfers")}`)
                    : t("Sample journey · transfer details appear after search")}
                </div>

                <button
                  type="button"
                  className={`route-button ${
                    selectedRoute === route.id ? "route-button-selected" : ""
                  }`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  {selectedRoute === route.id ? t("Selected route ✓") : t("Select this route")}
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>

          <div className="map-section">
            <span className="section-kicker">{liveRoutes ? t("CALCULATED ROUTES") : t("LIVE MAP PREVIEW")}</span>
            <h2>{t("Your journey, visualised")}</h2>
            <p className="map-disclaimer">{liveRoutes ? t("Route geometry and directions from Google Maps.") : t("Jaipur preview — compare a journey to calculate live routes.")}</p>
            <MapContainer
              key={routeGeometry ? JSON.stringify(routeEndpoints) : "jaipur-demo"}
              center={routeEndpoints ? routeEndpoints.from : [26.9124, 75.7873]}
              zoom={routeEndpoints ? 12 : 12}
              scrollWheelZoom
              style={{ height: "360px", width: "100%", borderRadius: "16px" }}
            >
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {routeGeometry ? <>
                <MapBounds routes={routeGeometry} />
                {routeEndpoints && <>
                  <Marker position={routeEndpoints.from}><Popup>{start}</Popup></Marker>
                  <Marker position={routeEndpoints.to}><Popup>{destination}</Popup></Marker>
                </>}
                {routeGeometry.map((route, index) => <Polyline key={index} positions={route.coordinates} pathOptions={{ color: route.color, weight: index === selectedRoute - 1 ? 6 : 4, opacity: index === selectedRoute - 1 ? 0.95 : 0.45 }} />)}
              </> : <>
                <Marker position={[26.9124, 75.7873]}><Popup>Jaipur — demo starting point</Popup></Marker>
                <Marker position={[26.9239, 75.8267]}><Popup>Demo destination</Popup></Marker>
                <Polyline positions={[[26.9124, 75.7873], [26.9180, 75.8050], [26.9239, 75.8267]]} pathOptions={{ color: "#58d6a4", weight: 5 }} />
              </>}
            </MapContainer>
          </div>
          <div className="connection-note">
            <span className="connection-icon">✦</span>
            <div>
              <strong>{t("BETTER JOURNEYS")}</strong>
              <p>{t("Live routes by Google Maps. Travel times reflect available route data and may change with traffic or transit schedules.")}</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <span className="section-kicker">ABOUT SMARTROUTE AI</span>
          <h2>Urban travel, made simpler.</h2>
          <p>
            SmartRoute AI is a prototype concept for helping people compare
            urban journeys based on their personal travel priorities.
          </p>
          <div className="about-tags">
            <span>Time-aware</span>
            <span>Budget-conscious</span>
            <span>Walking-aware</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-brand" href="#home">SmartRoute AI</a>
        <span>Hackathon prototype · Jaipur demo</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;


function MapBounds({ routes }) {
  const map = useMap();
  useEffect(() => {
    const points = routes.flatMap((route) => route.coordinates);
    if (points.length) map.fitBounds(points, { padding: [28, 28] });
  }, [map, routes]);
  return null;
}
