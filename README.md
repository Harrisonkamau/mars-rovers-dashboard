# Mars Dashboard Rover
Udacity nanodegree's accreditation Mars Rovers Dashboard project.

[![JS Linter](https://github.com/Harrisonkamau/mars-rovers-dashboard/actions/workflows/linter.yml/badge.svg?branch=main)](https://github.com/Harrisonkamau/mars-rovers-dashboard/actions/workflows/linter.yml)
[![Node Tests](https://github.com/Harrisonkamau/mars-rovers-dashboard/actions/workflows/tests.yml/badge.svg)](https://github.com/Harrisonkamau/mars-rovers-dashboard/actions/workflows/tests.yml)


## Overview
Gets a Mars rover's photos and creates a gallery slider for them.

As a bonus, the backend also exposes an endpoint to retrieve the picture of the day.

The user selects a rover from a dropdown menu. The frontend makes an API call to the backend to retrieve that rover's most recent photos. In the meantime, a loading state is shown on the UI.

## Architecture
The frontend implements pure functions that serve as `Components` (if you are familiar with React). However, no frontend framework is installed. It's just the ol' HTML-CSS-JS mix. All JS code (UI components) are located in `src/public/client.js`.

The backend runs on Node.js / Express.js without a DB.

## Technologies
- HTML
- CSS
- JS
- Node.js / Express.js

## Setup
- Clone the repo
- copy the `.env.sample` into an `.env` file:
```shell
cp .env.sample .env
```
- replace `NASA_API_KEY` with an actual NASA API KEY created [here](https://api.nasa.gov/#browseAPI)
- install Node packages: `yarn install`
- start dev server: `yarn dev`. Keep this server running
- Install frontend server:

Use either:
- [Chrome Web Server](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)
- [http-server](https://www.npmjs.com/package/http-server)
- [live-server](https://www.npmjs.com/package/live-server)

### Important Note
The backend runs on port `4000` by default. Changing this requires updating the request URL on the client-side [here](https://github.com/Harrisonkamau/mars-rovers-dashboard/blob/main/src/public/client.js#L41) and [here](https://github.com/Harrisonkamau/mars-rovers-dashboard/blob/main/src/public/client.js#L56).
Ensure that you keep this server running all the time. The command to run the dev server is either `yarn dev` or `npm run dev`.
