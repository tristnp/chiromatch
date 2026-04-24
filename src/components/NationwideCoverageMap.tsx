"use client";

import { useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geographyUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const mapCities = [
  { name: "Anchorage, AK", coordinates: [-149.9003, 61.2181] as [number, number] },
  { name: "Birmingham, AL", coordinates: [-86.8104, 33.5186] as [number, number] },
  { name: "Little Rock, AR", coordinates: [-92.2896, 34.7465] as [number, number] },
  { name: "Sacramento, CA", coordinates: [-121.4944, 38.5816] as [number, number] },
  { name: "Los Angeles, CA", coordinates: [-118.2437, 34.0522] as [number, number] },
  { name: "San Diego, CA", coordinates: [-117.1611, 32.7157] as [number, number] },
  { name: "Denver, CO", coordinates: [-104.9903, 39.7392] as [number, number] },
  { name: "Hartford, CT", coordinates: [-72.6851, 41.7658] as [number, number] },
  { name: "Dallas, TX", coordinates: [-96.797, 32.7767] as [number, number] },
  { name: "Wilmington, DE", coordinates: [-75.5484, 39.7447] as [number, number] },
  { name: "Miami, FL", coordinates: [-80.1918, 25.7617] as [number, number] },
  { name: "Tallahassee, FL", coordinates: [-84.2807, 30.4518] as [number, number] },
  { name: "Honolulu, HI", coordinates: [-157.8583, 21.3069] as [number, number] },
  { name: "Des Moines, IA", coordinates: [-93.625, 41.5868] as [number, number] },
  { name: "Boise, ID", coordinates: [-116.2023, 43.615] as [number, number] },
  { name: "Chicago, IL", coordinates: [-87.6298, 41.8781] as [number, number] },
  { name: "Indianapolis, IN", coordinates: [-86.1581, 39.7684] as [number, number] },
  { name: "Wichita, KS", coordinates: [-97.3301, 37.6872] as [number, number] },
  { name: "Louisville, KY", coordinates: [-85.7585, 38.2527] as [number, number] },
  { name: "New Orleans, LA", coordinates: [-90.0715, 29.9511] as [number, number] },
  { name: "Boston, MA", coordinates: [-71.0589, 42.3601] as [number, number] },
  { name: "Baltimore, MD", coordinates: [-76.6122, 39.2904] as [number, number] },
  { name: "Portland, ME", coordinates: [-70.2568, 43.6591] as [number, number] },
  { name: "Detroit, MI", coordinates: [-83.0458, 42.3314] as [number, number] },
  { name: "Minneapolis, MN", coordinates: [-93.265, 44.9778] as [number, number] },
  { name: "Kansas City, MO", coordinates: [-94.5786, 39.0997] as [number, number] },
  { name: "Jackson, MS", coordinates: [-90.1848, 32.2988] as [number, number] },
  { name: "Billings, MT", coordinates: [-108.5007, 45.7833] as [number, number] },
  { name: "Charlotte, NC", coordinates: [-80.8431, 35.2271] as [number, number] },
  { name: "Fargo, ND", coordinates: [-96.7898, 46.8772] as [number, number] },
  { name: "Omaha, NE", coordinates: [-95.9345, 41.2565] as [number, number] },
  { name: "Manchester, NH", coordinates: [-71.4548, 42.9956] as [number, number] },
  { name: "Albuquerque, NM", coordinates: [-106.6504, 35.0844] as [number, number] },
  { name: "Las Vegas, NV", coordinates: [-115.1398, 36.1699] as [number, number] },
  { name: "Reno, NV", coordinates: [-119.8138, 39.5296] as [number, number] },
  { name: "New York, NY", coordinates: [-74.006, 40.7128] as [number, number] },
  { name: "Albany, NY", coordinates: [-73.7562, 42.6526] as [number, number] },
  { name: "Columbus, OH", coordinates: [-82.9988, 39.9612] as [number, number] },
  { name: "Oklahoma City, OK", coordinates: [-97.5164, 35.4676] as [number, number] },
  { name: "Portland, OR", coordinates: [-122.675, 45.5051] as [number, number] },
  { name: "Providence, RI", coordinates: [-71.4128, 41.824] as [number, number] },
  { name: "Columbia, SC", coordinates: [-81.0348, 34.0007] as [number, number] },
  { name: "Sioux Falls, SD", coordinates: [-96.7311, 43.5446] as [number, number] },
  { name: "Seattle, WA", coordinates: [-122.3321, 47.6062] as [number, number] },
  { name: "Spokane, WA", coordinates: [-117.426, 47.6588] as [number, number] },
  { name: "Phoenix, AZ", coordinates: [-112.074, 33.4484] as [number, number] },
  { name: "Tucson, AZ", coordinates: [-110.9747, 32.2226] as [number, number] },
  { name: "Atlanta, GA", coordinates: [-84.388, 33.749] as [number, number] },
  { name: "Houston, TX", coordinates: [-95.3698, 29.7604] as [number, number] },
  { name: "Memphis, TN", coordinates: [-90.049, 35.1495] as [number, number] },
  { name: "Nashville, TN", coordinates: [-86.7816, 36.1627] as [number, number] },
  { name: "Salt Lake City, UT", coordinates: [-111.891, 40.7608] as [number, number] },
  { name: "Richmond, VA", coordinates: [-77.436, 37.5407] as [number, number] },
  { name: "Burlington, VT", coordinates: [-73.2121, 44.4759] as [number, number] },
  { name: "Milwaukee, WI", coordinates: [-88.0325, 43.0389] as [number, number] },
  { name: "Charleston, WV", coordinates: [-81.6326, 38.3498] as [number, number] },
  { name: "Cheyenne, WY", coordinates: [-104.8202, 41.14] as [number, number] }
];

type TooltipState = {
  city: string;
  x: number;
  y: number;
} | null;

export function NationwideCoverageMap() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  function updateTooltip(event: React.MouseEvent<SVGGElement>, city: string) {
    const bounds = wrapperRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    setTooltip({
      city,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    });
  }

  return (
    <div className="network-map" ref={wrapperRef}>
      <ComposableMap
        width={800}
        height={500}
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        className="network-map__svg"
        aria-label="United States coverage map showing highlighted ChiropracticMatch cities"
      >
        <Geographies geography={geographyUrl}>
          {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
            geographies.map((geography: { rsmKey: string }) => (
              <Geography
                key={geography.rsmKey}
                geography={geography}
                fill="transparent"
                stroke="#1A1A1A"
                strokeWidth={0.8}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>

        {mapCities.map((city) => (
          <Marker
            key={city.name}
            coordinates={city.coordinates}
            onMouseEnter={(event: React.MouseEvent<SVGGElement>) => updateTooltip(event, city.name)}
            onMouseMove={(event: React.MouseEvent<SVGGElement>) => updateTooltip(event, city.name)}
            onMouseLeave={() => setTooltip(null)}
          >
            <g className="network-map__marker" aria-label={`${city.name} Auto Accident Care`}>
              <circle className="network-map__pulse" r="14" />
              <circle className="network-map__pulse network-map__pulse--delay" r="14" />
              <circle className="network-map__dot" r="5" />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {tooltip ? (
        <div
          className="network-map__tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="network-map__tooltip-title">{tooltip.city}</div>
          <div className="network-map__tooltip-subtitle">Auto Accident Care</div>
        </div>
      ) : null}
    </div>
  );
}
