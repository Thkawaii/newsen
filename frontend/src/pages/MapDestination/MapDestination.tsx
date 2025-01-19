import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './MapDestination.css';
import { sendDataDestinationToBackend, fetchHistoryPlacesFromBackend } from '../../services/https/booking';



const containerStyle = {
  width: '100%',
  height: '400px',
};

const searchContainerStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#D9D7EF',
  left: '0',
  zIndex: '1000',
};

const MapDestination: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const navigate = useNavigate();
  const [historyPlaces, setHistoryPlaces] = useState<{ data: any[]; status: string }>({
    data: [],
    status: '',
  });
  

  const locationFromMapComponent = useLocation();
  const pickupLocation = locationFromMapComponent.state?.pickupLocation || null;
  const startLocationId = locationFromMapComponent.state?.startLocationId || null;

  // โหลด Google Maps API Script
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const existingScript = document.getElementById('google-maps-api');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCporibkdPqd7yC4nJEWMZI2toIlY23jM&libraries=places`;
        script.id = 'google-maps-api';
        script.async = true;
        script.onload = () => {
          console.log('Google Maps API loaded');
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  // ตั้งค่าตำแหน่งเริ่มต้นจาก pickupLocation
  useEffect(() => {
    if (pickupLocation) {
      setLocation(pickupLocation);
    } else {
      console.error('Pickup location is missing!');
    }
  }, [pickupLocation]);

  // ฟังก์ชันค้นหาสถานที่ใกล้เคียง
  const fetchNearbyPlaces = (location: { lat: number; lng: number }) => {
    if (!location) return;

    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    const types = ['restaurant', 'park', 'shopping_mall'];

    setNearbyPlaces([]);

    types.forEach((type) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        type,
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setNearbyPlaces((prev) => [
            ...prev,
            ...results.slice(0, 5).filter(
              (newPlace) => !prev.some((prevPlace) => prevPlace.place_id === newPlace.place_id)
            ),
          ]);
        }
      });
    });
  };

  const handleNearbyPlaceClick = (place: any) => {
    if (!place.geometry || !place.geometry.location) return;

    const location = place.geometry.location;
    setDestinationLocation({ name: place.name, lat: location.lat(), lng: location.lng() });

    if (map) {
      map.panTo(location);
      map.setZoom(15);
    }
  };

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results) {
        const placeName = results[0]?.formatted_address || 'ตำแหน่งที่เลือก';
        setDestinationLocation({ lat, lng, name: placeName });

        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    });
  };

  const handlePlaceSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    if (!event.target.value) {
      setNearbyPlaces([]);
      return;
    }

    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = { query: event.target.value, fields: ['place_id', 'geometry', 'name'] };

    placesService.findPlaceFromQuery(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 0
      ) {
        const firstResult = results[0];
    
        if (
          firstResult.geometry &&
          firstResult.geometry.location &&
          firstResult.name
        ) {
          const location = firstResult.geometry.location;
    
          if (map) {
            map.panTo(location);
            map.setZoom(15);
          }
    
          setDestinationLocation({
            name: firstResult.name,
            lat: location.lat(),
            lng: location.lng(),
          });
        }
      } else {
        console.error("Error or no results from findPlaceFromQuery:", status);
      }
    });
    
  };

  useEffect(() => {
    const getHistoryPlaces = async () => {
      console.log('Fetching history places from backend...');
      const historyPlacesData = await fetchHistoryPlacesFromBackend();
      console.log('History places fetched:', historyPlacesData);
      setHistoryPlaces(historyPlacesData);
    };
    getHistoryPlaces();
  }, []);


  const handleDestinationSubmit = async () => {
    if (destinationLocation) {
      try {
        const destinationId = await sendDataDestinationToBackend(destinationLocation);
        navigate('/maproute', {
          state: {
            pickupLocation,
            destinationLocation,
            destinationId,
            startLocationId,
          },
        });
      } catch (error) {
        console.error('Error sending destination to backend:', error);
      }
    } else {
      alert('กรุณาเลือกจุดหมายปลายทาง');
    }
  };

  if (!isLoaded || !location) return <div>กำลังโหลดแผนที่...</div>;

  return (
    <div className="destination" style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
        onClick={handleMapClick}
      >
        {destinationLocation && (
          <Marker position={{ lat: destinationLocation.lat, lng: destinationLocation.lng }} />
        )}
      </GoogleMap>

      <div style={searchContainerStyle}>
        <input
          type="text"
          value={searchText}
          onChange={handlePlaceSearch}
          placeholder="ค้นหาสถานที่"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #D9D7EF',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div className="list-place">
  <ul className="place-list">
    {historyPlaces.data && historyPlaces.data.length > 0 ? (
      historyPlaces.data.map((place: any, index: number) => (
        <li
          key={index}
          className="place-item"
          onClick={() => handleNearbyPlaceClick(place)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Add history icon */}
          <img
            src="https://img.icons8.com/ios-filled/50/808080/time-machine.png"
            alt="history icon"
            style={{ width: '20px', height: '20px' }}
          />
          <span>{place}</span>
        </li>
      ))
    ) : (
      <li className="place-item">ยังไม่มีสถานที่ที่เคยไป</li>
    )}
  </ul>

  {/* ปุ่ม Drop-off point */}
  <div className="pickup-button-container">
    <button className="pickup-button" onClick={handleDestinationSubmit}>
      Drop-off point
    </button>
  </div>
</div>
    </div>
  );
};

export default MapDestination;
