import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import WorkLocations from './entity/work-location.entity';
import WorkLocationLists from './entity/work.location-list.entity';

@Injectable()
export class WorkLocationService {
  constructor(
    @InjectRepository(WorkLocations)
    private workLocationsRepository: Repository<WorkLocations>,

    @InjectRepository(WorkLocationLists)
    private workLocationListRepository: Repository<WorkLocationLists>,
  ) { }

  async get(page: number, limit: number) {
    if (page <= 0) {
      page = 1;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await this.workLocationsRepository.findAndCount({
      take: limit,
      skip
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      page,
      totalPages,
      totalRows: total,
    };
  }

  async getId(id: string): Promise<WorkLocations> {
    const userLocation = await this.workLocationsRepository.findOne({
      where: { id },
    });
    if (!userLocation)
      throw new HttpException(
        `Lokasi dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    return userLocation;
  }

  async create(payload: any): Promise<WorkLocations[]> {
    const location = this.workLocationsRepository.create(payload);
    console.log(location);

    const createdLocation : any= await this.workLocationsRepository.save(location);

    const { location: locations } = payload;

    if (locations && locations.length > 0) {
      const locationListEntities = locations.map((loc) =>
        this.workLocationListRepository.create({
          lat: loc.lat,
          lng: loc.lng,
          location_id: createdLocation.id, 
        }),
      );

      await this.workLocationListRepository.save(locationListEntities);
    }

    return createdLocation;
  }

  async update(id: string, payload: any): Promise<WorkLocations> {
    const location = await this.workLocationsRepository.findOne({
      where: { id },
    });

    if (!location)
      throw new HttpException(
        `Lokasi dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    await this.workLocationsRepository.update(id, payload);
    const updatedLocation = await this.workLocationsRepository.findOne({
      where: { id },
    });

    return updatedLocation;
  }

  async delete(id: string): Promise<void> {
    const location = await this.workLocationsRepository.findOne({
      where: { id },
    });

    if (!location)
      throw new HttpException(
        `Lokasi dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    await this.workLocationsRepository.delete(id);
  }
}
