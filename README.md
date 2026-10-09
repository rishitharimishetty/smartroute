# SmartRoute AI

SmartRoute is a React + Vite journey comparison prototype. Live route data is requested through a small local Node server so the Google Maps API key stays out of the browser bundle.

## Enable Google Routes

1. In Google Cloud Console, create a project, enable **Routes API**, enable billing, and create an API key. Restrict the key to the Routes API and set usage quotas/budget alerts.
2. Copy `.env.example` to `.env` in the project root and replace `your_key_here` with the key. Never commit `.env` or paste the key into frontend code.
3. In one VS Code terminal, run `npm run api`.
4. In a second VS Code terminal, run `npm run dev` and open the local URL Vite prints.
5. Search for two locations, then choose public transit, driving, walking, cycling, or two-wheeler. Hindi and English are available from the header language menu.

Google returns route estimates based on its available map, traffic, and transit data. It returns transit fare only when it can determine fares for every transit step, so some routes will say that fare data is unavailable. Transit availability varies by region and schedule. Driving time can change with traffic. Treat all returned values as estimates, not guaranteed arrival times or prices.

For deployment, host the Node API server and frontend behind HTTPS, set `GOOGLE_MAPS_API_KEY` in the hosting provider's server-side environment, and configure the Vite `/api` proxy equivalent at the production web server. Do not expose the server key in a `VITE_*` variable.
