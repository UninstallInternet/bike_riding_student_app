import { TextField } from "@mui/material";
import { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// School's fixed coordinates
const SCHOOL_LOCATION = {
  lat: 43.25983,
  lng: -2.936812,
};

export const AddressAutocomplete = ({
  onAddressChange,
  onDistanceChange,
}: {
  onAddressChange: (address: string) => void;
  onDistanceChange: (distance: number) => void;
}) => {
  const [address, setAddress] = useState("");

  // Handle address selection and biking distance calculation
  const handleSelect = async (selectedAddress: string) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const { lat, lng } = await getLatLng(results[0]);

      // Distance Matrix API to get biking distance
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [SCHOOL_LOCATION],
          destinations: [{ lat, lng }],
          travelMode: window.google.maps.TravelMode.BICYCLING,
        },
        (response, status) => {
          if (response && status === "OK") {
            const element = response.rows[0].elements[0];
            if (element.status === "OK") {
              const distanceInMeters = element.distance.value;
              const distanceInKm = distanceInMeters / 1000; // Convert meters to km
              console.log(
                `Biking distance from school to ${selectedAddress}: ${distanceInKm.toFixed(
                  2
                )} km`
              );
              onDistanceChange(distanceInKm);
            } else {
              console.error(
                "Error with DistanceMatrixService:",
                element.status
              );
            }
          } else {
            console.error("Error fetching biking distance:", status);
          }
        }
      );

      // Update local address state
      setAddress(selectedAddress);

      console.log("Selected address:", selectedAddress);
      onAddressChange(selectedAddress);
    } catch (error) {
      console.error("Error selecting address:", error);
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
          <div className="autocomplete-dropdown-container z-0">
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
