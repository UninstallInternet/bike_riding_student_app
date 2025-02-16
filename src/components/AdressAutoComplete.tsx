import { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { theme } from "../theme/theme";
import { SCHOOL_LOCATION } from "../lib/staticConsts";


export const AddressAutocomplete = ({
  onAddressChange,
  onDistanceChange,
  initialAddress = "",
}: {
  onAddressChange: (address: string | undefined, lat: number | undefined, lng: number | undefined) => void;
  onDistanceChange: (distance: number, isValid: boolean) => void;
  initialAddress?: string;
}) => {
  const [address, setAddress] = useState(initialAddress);
  

  useEffect(() => {
    if (address && window.google && window.google.maps) {
      calculateDistance(address);
    }
  }, [address]);

  const calculateDistance = async (selectedAddress: string) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const { lat, lng } = await getLatLng(results[0]);
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [{ lat: SCHOOL_LOCATION.lat, lng: SCHOOL_LOCATION.lng }],
          destinations: [{ lat, lng }],
          travelMode: window.google.maps.TravelMode.BICYCLING,
        },
        (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
          if (response && status === window.google.maps.DistanceMatrixStatus.OK) {
            const element = response.rows[0].elements[0];

            if (element && element.status === window.google.maps.DistanceMatrixElementStatus.OK) {
              const distanceInMeters = element.distance.value;
              const distanceInKm = Number((distanceInMeters / 1000).toFixed(2));

              console.log(`Biking distance from school to ${selectedAddress}: ${distanceInKm} km`);
              onDistanceChange(distanceInKm, true);
            } else {
              console.error("No route found or invalid destination:", element?.status);
              onDistanceChange(0, false);
            }
          } else {
            console.error("Error fetching biking distance:", status);
            onDistanceChange(0, false);
          }
        }
      );
    } catch (error) {
      console.error("Error calculating distance:", error);
      onDistanceChange(0, false);
    }
  };

  const handleSelect = async (selectedAddress: string) => {
    try {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps JavaScript library not loaded");
        return;
      }

      setAddress(selectedAddress);

      const results = await geocodeByAddress(selectedAddress);
      const { lat, lng } = await getLatLng(results[0]);

      onAddressChange(selectedAddress, lat, lng);
    } catch (error) {
      console.error("Error selecting address:", error);
      onAddressChange(undefined, undefined, undefined); 
      onDistanceChange(0, false);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(newAddress) => {
        setAddress(newAddress);
        onAddressChange(newAddress, undefined, undefined);
      }}
      onSelect={handleSelect}
      searchOptions={{
        componentRestrictions: { country: "be" }, 
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <Box sx={{ position: "relative" }}>
          <TextField
            {...getInputProps({
              fullWidth: true,
              label: "Address",
              placeholder: "Enter your address",
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: theme.typography.fontFamily,
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                },
              },
            })}
          />
          <Box
            sx={{
              position: "absolute",
              zIndex: 1000,
              width: "100%",
              backgroundColor: "white",
              borderRadius: "4px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: theme.typography.fontFamily, 
            }}
          >
            {suggestions.map((suggestion) => (
              <Box
                {...getSuggestionItemProps(suggestion)}
                key={suggestion.placeId}
                sx={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontFamily: theme.typography.fontFamily,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                {suggestion.description}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </PlacesAutocomplete>
  );
};
