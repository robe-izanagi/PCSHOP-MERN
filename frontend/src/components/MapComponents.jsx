import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./css/map.module.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = () => {
  const position = [14.044464779438496, 121.1575209078627]; // Your store coordinates

  return (
    <div className={styles.container}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true} 
        doubleClickZoom={true} 
        touchZoom={true} 
        boxZoom={true} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="<p>Malvar Batangas, near BSU Malvar Campus</p>"
        />
        <Marker position={position}>
          <Popup>
            <strong>Our Store</strong>
            <br />
            Malvar, Batangas, near BSU Malvar Campus
            <br />
            Coordinates: 14.044464779438496, 121.1575209078627
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
