import { useState } from 'react';
import ReactGlobe from 'react-globe.gl';
// import 'tippy.js/dist/tippy.css'; // Optional: for tooltip styling
// import 'tippy.js/animations/scale.css'; // Optional: for tooltip animations

export default function LandingPage() {
  // More realistic city data for markers on the globe
  const markers = [
    { id: 'marker1', city: 'Tokyo', country: 'Japan', coordinates: [35.6762, 139.6503], population: '37.4M' },
    { id: 'marker2', city: 'Delhi', country: 'India', coordinates: [28.6139, 77.2090], population: '31.4M' },
    { id: 'marker3', city: 'Shanghai', country: 'China', coordinates: [31.2304, 121.4737], population: '27.1M' },
    { id: 'marker4', city: 'Sao Paulo', country: 'Brazil', coordinates: [-23.5505, -46.6333], population: '22.0M' },
    { id: 'marker5', city: 'Mexico City', country: 'Mexico', coordinates: [19.4326, -99.1332], population: '21.9M' },
    { id: 'marker6', city: 'Cairo', country: 'Egypt', coordinates: [30.0444, 31.2357], population: '20.9M' },
    { id: 'marker7', city: 'Dhaka', country: 'Bangladesh', coordinates: [23.8103, 90.4125], population: '21.0M' },
    { id: 'marker8', city: 'Mumbai', country: 'India', coordinates: [19.0760, 72.8777], population: '20.4M' },
    { id: 'marker9', city: 'Beijing', country: 'China', coordinates: [39.9042, 116.4074], population: '20.4M' },
    { id: 'marker10', city: 'Osaka', country: 'Japan', coordinates: [34.6937, 135.5023], population: '19.2M' },
    { id: 'marker11', city: 'New York', country: 'USA', coordinates: [40.7128, -74.0060], population: '8.3M' },
    { id: 'marker12', city: 'Karachi', country: 'Pakistan', coordinates: [24.8607, 67.0011], population: '16.1M' },
    { id: 'marker13', city: 'Chongqing', country: 'China', coordinates: [29.5630, 106.5516], population: '15.9M' },
    { id: 'marker14', city: 'Istanbul', country: 'Turkey', coordinates: [41.0082, 28.9784], population: '15.5M' },
    { id: 'marker15', city: 'Buenos Aires', country: 'Argentina', coordinates: [-34.6037, -58.3816], population: '15.2M' },
    { id: 'marker16', city: 'Kolkata', country: 'India', coordinates: [22.5726, 88.3639], population: '14.9M' },
    { id: 'marker17', city: 'Lagos', country: 'Nigeria', coordinates: [6.5244, 3.3792], population: '14.4M' },
    { id: 'marker18', city: 'Kinshasa', country: 'DR Congo', coordinates: [-4.4419, 15.2663], population: '14.3M' },
    { id: 'marker19', city: 'Manila', country: 'Philippines', coordinates: [14.5995, 120.9842], population: '13.9M' },
    { id: 'marker20', city: 'Rio de Janeiro', country: 'Brazil', coordinates: [-22.9068, -43.1729], population: '13.5M' },
    { id: 'marker21', city: 'London', country: 'UK', coordinates: [51.5074, -0.1278], population: '9.0M' },
    { id: 'marker22', city: 'Paris', country: 'France', coordinates: [48.8566, 2.3522], population: '10.9M' },
    { id: 'marker23', city: 'Moscow', country: 'Russia', coordinates: [55.7558, 37.6173], population: '12.5M' },
    { id: 'marker24', city: 'Los Angeles', country: 'USA', coordinates: [34.0522, -118.2437], population: '3.9M' },
    { id: 'marker25', city: 'Cape Town', country: 'South Africa', coordinates: [-33.9249, 18.4241], population: '4.7M' },
  ];

  // State to capture globe instance and control overlay visibility
  const [globe, setGlobe] = useState<GlobeInstance | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Globe configuration options
  const globeOptions = {
    globeImageUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg', // Daytime texture
    emissiveImageUrl: '//unpkg.com/three-globe/example/img/earth-night.jpg', // Nighttime lights
    emissiveIntensity: 0.8, // Intensity of nighttime glow
    bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.jpg', // Bump map for terrain
    backgroundImageUrl: '//unpkg.com/three-globe/example/img/night-sky.png', // Starry background
    backgroundColor: 'rgba(0,0,0,0)', // Transparent background to show stars
    atmosphereColor: 'lightblue',
    atmosphereAltitude: 0.15,
    pointRadius: 0.3, // Size of marker points
    pointAltitude: 0.01, // Height of markers above globe surface (lower for realism)
    cameraRotateSpeed: 0.5,
    focusAnimationDuration: 2000,
  };

  interface Marker {
    id: string;
    city: string;
    country: string;
    coordinates: [number, number];
    population: string;
  }

  interface GlobeInstance {
    controls: () => {
      autoRotate: boolean;
      autoRotateSpeed: number;
      addEventListener: (event: string, handler: () => void) => void;
    };
  }

  const handleGlobeReady = (globeInstance: GlobeInstance) => {
    setGlobe(globeInstance);
    // Enable auto-rotation
    globeInstance.controls().autoRotate = true;
    globeInstance.controls().autoRotateSpeed = 0.35; // Speed in degrees per frame (60fps)
    // Hide overlay on user interaction start (drag, zoom, etc.)
    globeInstance.controls().addEventListener('start', () => setShowOverlay(false));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ReactGlobe
      width="100%"
      height="100%"
      globeImageUrl={globeOptions.globeImageUrl}
      emissiveImageUrl={globeOptions.emissiveImageUrl}
      emissiveIntensity={globeOptions.emissiveIntensity}
      bumpImageUrl={globeOptions.bumpImageUrl}
      backgroundImageUrl={globeOptions.backgroundImageUrl}
      backgroundColor={globeOptions.backgroundColor}
      atmosphereColor={globeOptions.atmosphereColor}
      atmosphereAltitude={globeOptions.atmosphereAltitude}
      pointsData={markers as Marker[]}
      pointLat={(d: Marker) => d.coordinates[0]}
      pointLng={(d: Marker) => d.coordinates[1]}
      pointColor={(): string => '#ffdd00'} // Yellow for visibility
      pointRadius={globeOptions.pointRadius}
      pointAltitude={globeOptions.pointAltitude}
      pointLabel={(d: Marker) => `${d.city}, ${d.country}<br>Population: ${d.population}`} // Tooltip content
      cameraRotateSpeed={globeOptions.cameraRotateSpeed}
      focusAnimationDuration={globeOptions.focusAnimationDuration}
      onGlobeReady={handleGlobeReady}
      onClickMarker={(marker: Marker) => console.log(`Clicked: ${marker.city}`)}
      animateIn={true}
      />
      {showOverlay && (
      <div
        style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
        pointerEvents: 'none', // Allow clicks through to globe if needed
        zIndex: 1,
        } as React.CSSProperties}
      >
        <h1>Welcome to MyWorld Explorer</h1>
        <p>Interact with the globe to explore cities around the world.</p>
        <p>The globe auto-rotates to simulate day and night transitions.</p>
      </div>
      )}
    </div>
  );
}