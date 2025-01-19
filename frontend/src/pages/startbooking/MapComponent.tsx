import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './MapComponent.css';
import { sendDataStartlocationToBackend } from '../../services/https/booking';
import Loader from '../../components/Loadable/Loader';

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

const MapComponent: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const navigate = useNavigate();

  // Load Google Maps API Script
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

  // Get user location and fetch nearby places
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Fetched new location:', userLocation);
          setLocation(userLocation);

          if (map) {
            map.panTo(userLocation);
            map.setZoom(15);
          }

          fetchNearbyPlaces(userLocation);
        },
        (error) => {
          console.error('Error fetching location:', error);

          // Fallback to default location
          const defaultLocation = {
            lat: 13.736717, // Default to Bangkok
            lng: 100.523186,
          };
          console.log('Using default location:', defaultLocation);
          setLocation(defaultLocation);

          if (map) {
            map.panTo(defaultLocation);
            map.setZoom(15);
          }

          fetchNearbyPlaces(defaultLocation);
        },
        {
          enableHighAccuracy: true, // ใช้ GPS แม่นยำสูง
          timeout: 10000,          // รอเวลา 10 วินาที
          maximumAge: 0,           // บังคับให้ดึงตำแหน่งใหม่ทุกครั้ง
        }
      );
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchLocation();
    }
  }, [isLoaded, map]);

  const fetchNearbyPlaces = (location: { lat: number; lng: number }) => {
    console.log('Fetching nearby places for location:', location);
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
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          console.log(`Nearby places for type ${type} found:`, results);

          setNearbyPlaces((prev) => {
            const uniquePlaces = [
              ...prev,
              ...results.filter(
                (newPlace) => !prev.some((prevPlace) => prevPlace.place_id === newPlace.place_id)
              ),
            ];
            return uniquePlaces.slice(0, 5);
          });
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log(`No results for type ${type}`);
        } else {
          console.error('Error fetching nearby places:', status);
        }
      });
    });
  };

  
  const handleNearbyPlaceClick = (place: any) => {
    if (!place.geometry || !place.geometry.location) return;
  
    const location = place.geometry.location;
    const name = place.name || "ไม่ทราบชื่อสถานที่"; // ดึงชื่อสถานที่โดยตรงจาก place.name
    setPickupLocation({ name, lat: location.lat(), lng: location.lng() });
  
    if (map) {
      map.panTo(location);
      map.setZoom(15);
    }
  
    console.log("Nearby Place Name:", name); // log ชื่อสถานที่
  };
  
  

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
  
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const placeId = results[0].place_id; // ดึง place_id จาก Geocoder
        if (placeId) {
          const service = new window.google.maps.places.PlacesService(map);
          service.getDetails({ placeId }, (place, placeStatus) => {
            if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK && place) {
              // ดึงชื่อสถานที่ที่ดีที่สุด
              const placeName =
                place.name && place.name.length > 1
                  ? place.name
                  : results[0].formatted_address.split(",")[0]; // fallback หากไม่มี name
              setPickupLocation({ name: placeName, lat, lng });
              console.log("Place Name (from Place Details):", placeName);
            } else {
              console.error("Failed to fetch place details:", placeStatus);
              setPickupLocation({ name: "ตำแหน่งที่ไม่ทราบชื่อ", lat, lng });
            }
          });
        } else {
          console.error("No place_id found");
          setPickupLocation({ name: "ตำแหน่งที่ไม่ทราบชื่อ", lat, lng });
        }
      } else {
        console.error("Error fetching place name:", status);
        setPickupLocation({ name: "ตำแหน่งที่ไม่ทราบชื่อ", lat, lng });
      }
    });
  
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(15);
    }
  };
  
  
  const handlePickUpSubmit = async () => {
    if (pickupLocation) {
      try {
        const startLocationId = await sendDataStartlocationToBackend(pickupLocation);
        navigate('/mapdestination', { state: { pickupLocation, startLocationId } });
      } catch (error) {
        console.error('Error sending pickup location:', error);
        alert('ไม่สามารถบันทึกข้อมูลจุดเริ่มต้นได้');
      }
    } else {
      alert('กรุณาเลือกจุดเริ่มต้นก่อน');
    }
  };

  if (!isLoaded || !location) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="mapcomponent" style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || { lat: 13.736717, lng: 100.523186 }}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
        onClick={handleMapClick}
      >
        {pickupLocation && (
          <Marker position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} />
        )}
      </GoogleMap>

      <div style={searchContainerStyle}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
          {nearbyPlaces.length > 0 ? (
            nearbyPlaces.map((place, index) => (
              <li
                key={index}
                className="place-item"
                onClick={() => handleNearbyPlaceClick(place)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/FF0000/marker.png"
                  alt="marker icon"
                  style={{ width: '20px', height: '20px' }}
                />
                <span>{place.name}</span>
              </li>
            ))
          ) : (
            <li className="place-item">ไม่พบสถานที่ใกล้เคียง</li>
          )}
        </ul>

        <div className="pickup-button-container">
          <button className="pickup-button" onClick={handlePickUpSubmit}>
            Pick-up point
          </button>

        </div>
      </div>
    </div>
  );
};

export default MapComponent;
