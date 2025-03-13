# ISS Tracker Application

A simple React application that tracks the International Space Station's (ISS) current location in real-time.

## Features

- Real-time tracking of ISS latitude and longitude
- Updates every 5 seconds
- Clean and responsive user interface
- Modern space-themed design

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/iss-tracker.git
cd iss-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

The application automatically fetches and displays the current position of the International Space Station. The coordinates are updated every 5 seconds to show the ISS's real-time location.

## Technologies Used

- React
- Vite
- CSS3
- Open Notify API

## API Reference

This application uses the Open Notify API to fetch ISS position data:

- Endpoint: `http://api.open-notify.org/iss-now.json`
- Updates every 5 seconds
- Returns current latitude and longitude coordinates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
