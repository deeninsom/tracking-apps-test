import axios from 'axios';

export const getAddressComponents = async (lat: any, lng: any) => {
  const googleMapsResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_KEY}`,
  );
  const locationJson = JSON.stringify(googleMapsResponse.data.results[3]);
  return locationJson;
};
