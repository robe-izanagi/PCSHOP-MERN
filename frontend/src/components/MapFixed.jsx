// import React, { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// export default function MapFixed({
//   lat = 14.044464779438496,
//   lng = 121.1575209078627,
//   zoom = 16,
//   width = 500,
//   height = 500,
// }) {
//   const mapRef = useRef(null);
//   const containerRef = useRef(null);
//   const isRecenteringRef = useRef(false);

//   useEffect(() => {
//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl: markerIcon2x,
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//     });

//     if (!containerRef.current) return;

//     // create map
//     mapRef.current = L.map(containerRef.current, {
//       center: [lat, lng],
//       zoom,
//       zoomControl: true,
//       attributionControl: false,
//       // disable interactions except the zoom control buttons
//       dragging: false,
//       touchZoom: false,
//       scrollWheelZoom: false,
//       doubleClickZoom: false,
//       boxZoom: false,
//       keyboard: false,
//       tap: false,
//     });

//     // Add tile layer (OpenStreetMap)
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 19,
//       detectRetina: true,
//     }).addTo(mapRef.current);

//     // add marker (will now use correct images imported above)
//     const marker = L.marker([lat, lng], { interactive: false }).addTo(
//       mapRef.current
//     );

//     // keep map centered on the given coordinates in case some event tries to change it
//     const keepCenter = () => {
//       const map = mapRef.current;
//       if (!map) return;

//       try {
//         if (isRecenteringRef.current) return;

//         const center = map.getCenter();
//         const latDiff = Math.abs(center.lat - lat);
//         const lngDiff = Math.abs(center.lng - lng);
//         const threshold = 1e-6; // tiny epsilon

//         if (latDiff > threshold || lngDiff > threshold) {
//           isRecenteringRef.current = true;
//           // when the next moveend fires (caused by our setView), reset the guard
//           map.once("moveend", () => {
//             isRecenteringRef.current = false;
//           });

//           // recenter without animation
//           map.setView([lat, lng], map.getZoom(), { animate: false });
//         }
//       } catch (err) {
//         // swallow errors to avoid flooding console
//       }
//     };

//     mapRef.current.on("moveend", keepCenter);

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.off("moveend", keepCenter);
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [lat, lng, zoom]);

//   const style = {
//     width: typeof width === "number" ? `${width}px` : width,
//     height: typeof height === "number" ? `${height}px` : height,
//     borderRadius: 8,
//     overflow: "hidden",
//   };

//   return <div ref={containerRef} style={style} />;
// }
