// src/components/common/GoogleMap.tsx
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={{ lat: 23.8103, lng: 90.4125 }} // Dhaka
        zoom={13}
      >
        {/* Hospital Markers */}
        <Marker
          position={{ lat: 23.8103, lng: 90.4125 }}
          onClick={() => setSelectedMarker({ name: 'City Hospital' })}
          icon="http://maps.google.com/mapfiles/ms/icons/hospital.png"
        />
        
        {/* Pharmacy Markers */}
        <Marker
          position={{ lat: 23.8150, lng: 90.4200 }}
          icon="http://maps.google.com/mapfiles/ms/icons/pharmacy.png"
        />
        
        {/* Ambulance Markers (Live) */}
        <Marker
          position={{ lat: 23.8200, lng: 90.4150 }}
          icon="http://maps.google.com/mapfiles/ms/icons/ambulance.png"
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;