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
    const queryBuilder = this.workLocationsRepository.createQueryBuilder('work');
    queryBuilder.leftJoinAndSelect('work.location_list', 'location_list');
    queryBuilder.orderBy('location_list.list_number', 'ASC');
    queryBuilder.addOrderBy('work.created_at', 'DESC');

    let dataQuery = queryBuilder;
    
    if (limit && page) {
      const skip = (page - 1) * limit;
      dataQuery = queryBuilder.take(limit).skip(skip);
    }

    const [data, total] :any = await dataQuery.getManyAndCount();
    const totalPages = limit && page ? Math.ceil(total / limit) : undefined;

    return {
      data: data || [],
      page: limit && page ? page : undefined,
      totalPages,
      totalRows: total,
    };
  }

  async getId(id: string): Promise<any> {
    const queryBuilder = this.workLocationsRepository.createQueryBuilder('work');
    queryBuilder.leftJoinAndSelect('work.location_list', 'location_list')
    queryBuilder.where('work.id = :id', { id });
    queryBuilder.addOrderBy('location_list.list_number', 'ASC');

    const workLocation = await queryBuilder.getOne();

    if (!workLocation) {
      throw new HttpException(
        `Lokasi dengan id ${id} tidak ditemukan!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return workLocation;
  }

  async create(payload: any): Promise<WorkLocations[]> {
    if (payload.location.length <= 0) {
      throw new HttpException(
        `Data list lokasi belum ada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = this.workLocationsRepository.create(payload);

    const createdLocation: any = await this.workLocationsRepository.save(location);

    const { location: locations } = payload;


    if (locations && locations.length > 0) {
      const locationList = locations.map((val: any) => { return { lat: val.lat, lng: val.lng, list_number: val.list_number, location_id: createdLocation.id } })

      await this.workLocationListRepository
        .createQueryBuilder()
        .insert()
        .into(WorkLocationLists)
        .values(locationList)
        .execute()
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
      relations: ['location_list']
    });


    if (!location)
      throw new HttpException(
        `Lokasi dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    await this.workLocationsRepository.delete(id);
  }
}
