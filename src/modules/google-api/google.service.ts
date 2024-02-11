import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class GoogleApiService {

  async getPlaceFromLatLng(lat: number, lng: number): Promise<any> {
    const apiKey = process.env.GOOGLE_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    let result = {}
    await axios.get(url)
    .then((res)=>{
        result = res.data
        return result
    }).catch((err)=>{
        return err
    })
    return result
  }

}