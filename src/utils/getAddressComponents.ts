import axios from 'axios';

export const getAddressComponents = async (lat: string, lng: string) => {
  const googleMapsResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_KEY}`,
  );
  const locationJson = JSON.stringify(googleMapsResponse.data.results[0]);
  return locationJson;
};
