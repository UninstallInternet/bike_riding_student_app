import { useState } from "react";
import { TextField } from "@mui/material";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const SCHOOL_LOCATION = {
  lat: 43.25983,
  lng: -2.936812,
};

export const AddressAutocomplete = ({
  onAddressChange,
  onDistanceChange,
}: {
  onAddressChange: (address: string | undefined) => void;
  onDistanceChange: (distance: number) => void;
}) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (selectedAddress: string) => {
    try {
      // Check if Google Maps library is loaded
      if (!window.google || !window.google.maps) {
        console.error("Google Maps JavaScript library not loaded");
        return;
      }

      const results = await geocodeByAddress(selectedAddress);
      const { lat, lng } = await getLatLng(results[0]);

      // Distance Matrix API to get biking distance
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [{ lat: SCHOOL_LOCATION.lat, lng: SCHOOL_LOCATION.lng }],
          destinations: [{ lat, lng }],
          travelMode: window.google.maps.TravelMode.BICYCLING,
        },
        (response, status) => {
          if (
            response &&
            status === window.google.maps.DistanceMatrixStatus.OK
          ) {
            const element = response.rows[0].elements[0];

            if (
              element &&
              element.status ===
                window.google.maps.DistanceMatrixElementStatus.OK
            ) {
              const distanceInMeters = element.distance.value;
              const distanceInKm = Number((distanceInMeters / 1000).toFixed(2));

              console.log(
                `Biking distance from school to ${selectedAddress}: ${distanceInKm} km`
              );

              onDistanceChange(distanceInKm);
            } else {
              console.error(
                "No route found or invalid destination:",
                element?.status
              );
              onDistanceChange(0);
            }
          } else {
            console.error("Error fetching biking distance:", status);
            onDistanceChange(0);
          }
        }
      );

      // Update local address state
      setAddress(selectedAddress);
      onAddressChange(selectedAddress);
    } catch (error) {
      console.error("Error selecting address:", error);
      onAddressChange(undefined);
      onDistanceChange(0);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <TextField
            {...getInputProps({
              fullWidth: true,
              label: "Address",
              placeholder: "Enter your address",
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              },
            })}
          />
          <div className="autocomplete-dropdown-container">
            {suggestions.map((suggestion) => (
              <div
                {...getSuggestionItemProps(suggestion)}
                key={suggestion.placeId}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};
