import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export const getAddressComponents = async (lat: any, lng: any) => {
  try {
    const googleMapsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_KEY}`,
    );

    const locationJson = JSON.stringify(googleMapsResponse.data.results[3]);
    console.log(googleMapsResponse.data.results[3])
    return locationJson;
  } catch (error: any) {
    throw new HttpException(
      `Lokasi dengan lattitude : ${lat} dan longtittude : ${lng} tidak ditemukan !`,
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const getAddress = async (lat: any, lng: any) => {
  if (!lat || !lng) return null
  try {
    const googleMapsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_KEY}`,
    );

    const locationJson = googleMapsResponse.data.results[0].formatted_address
    return locationJson;
  } catch (error: any) {
    throw new HttpException(
      `Lokasi dengan lattitude : ${lat} dan longtittude : ${lng} tidak ditemukan !`,
      HttpStatus.BAD_REQUEST,
    );
  }
};
