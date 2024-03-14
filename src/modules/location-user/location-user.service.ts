import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserLocations from './location-user.entity';
import { SocketGateway } from '../socket/socket.service';
import { TimerService } from '../timer/timer.service';
import { getAddressComponents } from '../../utils/getAddressComponents';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocations)
    private locationUserRepository: Repository<UserLocations>,

    private readonly socketGateway: SocketGateway,
    private readonly timerService: TimerService,
  ) { }

  async get(
  ) {
    const queryBuilder = this.locationUserRepository.createQueryBuilder('lokasi_user');
    queryBuilder.leftJoinAndSelect('lokasi_user.user_id', 'user')
      .innerJoin(subQuery => {
        return subQuery
          .select("lu.user_id", "userId")
          .addSelect("MAX(lu.created_at)", "maxCreatedAt")
          .from("user_locations", "lu")
          .groupBy("lu.user_id");
      }, "latestUserEntries", "lokasi_user.user_id = latestUserEntries.userId AND lokasi_user.created_at = latestUserEntries.maxCreatedAt")
    .select([
      'lokasi_user.id',
      'lokasi_user.lat',
      'lokasi_user.lng',
      'lokasi_user.isActive',
      'user.id',
      'user.name',
      'lokasi_user.created_at',
      'lokasi_user.updated_at'
    ])
    // if (year)
    //   queryBuilder.andWhere('YEAR(lokasi_user.created_at) = :created_at', {
    //     created_at: year,
    //   });
    // if (month)
    //   queryBuilder.andWhere('MONTH(lokasi_user.created_at) = :created_at', {
    //     created_at: month,
    //   });
    // if (day)
    //   queryBuilder.andWhere('DAY(lokasi_user.created_at) = :created_at', {
    //     created_at: day,
    //   });

    // if (userId) {
    //   queryBuilder.andWhere(
    //     `lokasi_user.created_at = (SELECT MAX(created_at) FROM user_locations WHERE user_id IN user_id)`
    //   );
    // }

    // if (sort == true) {
    //   queryBuilder.andWhere('DATE(lokasi_user.created_at) = CURDATE()');
    //   queryBuilder.addOrderBy('lokasi_user.created_at', 'DESC');
    // }



    const dataResult : any= await queryBuilder.getMany();

    return {
      data: dataResult || []
    };
  }

  async getLocationUsersV2(
    userId: string,
    date: string,
    sort: any,
    page: number,
    limit: number,
  ) {
    const queryBuilder =
      this.locationUserRepository.createQueryBuilder('lokasi_user');

    if (userId) {
      queryBuilder.andWhere('lokasi_user.user_id LIKE :user_id', {
        user_id: userId,
      });
    }

    if (date)
      queryBuilder.andWhere('DATE(lokasi_user.created_at) = :date', { date });

    if (sort) {
      queryBuilder.orderBy('lokasi_user.created_at', sort);
    }

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = limit && page ? Math.ceil(total / limit) : undefined;

    return {
      data: data || [],
      page: limit && page ? page : undefined,
      totalPages,
      totalRows: total,
    };
  }

  async createLocationUserV2(
    userId: any,
    lat: any,
    lng: any,
  ): Promise<any> {
    try {
      const locationJson = await getAddressComponents(lat, lng);
      const payload: any = {
        user_id: userId,
        lat: lat,
        lng: lng,
        isActive: true,
        location_json: locationJson
      }
      if (locationJson) {
        const locationUser: any = this.locationUserRepository.create(payload);
        const newLocationUser = await this.locationUserRepository.save(
          locationUser,
        );

        this.timerService.create(lat, lng, userId)
        return newLocationUser;
      }
    } catch (error) {
      return error
    }
  }

  async getForMobile(userId: string) {
    const queryBuilder =
      this.locationUserRepository.createQueryBuilder('lokasi_user');
    queryBuilder.leftJoinAndSelect('lokasi_user.user_id', 'user_id');

    if (userId) {
      queryBuilder.andWhere('lokasi_user.user_id LIKE :user_id', {
        user_id: userId,
      });
      queryBuilder.andWhere('DATE(lokasi_user.created_at) = CURDATE()');
      queryBuilder.addOrderBy('lokasi_user.created_at', 'DESC');
    }

    const [data] = await queryBuilder.getManyAndCount();

    return {
      data: data || [],
    };
  }

  async getId(id: string): Promise<UserLocations> {
    const queryBuilder = this.locationUserRepository.createQueryBuilder('lokasi_user');
    queryBuilder.leftJoinAndSelect('lokasi_user.user_id', 'user_id');
    queryBuilder.andWhere(
      `lokasi_user.created_at = (SELECT MAX(created_at) FROM user_locations WHERE user_id = :id)`, { id }
    );
    return queryBuilder.getOne();
  }

  create(payload: any): Promise<UserLocations[]> {
    return new Promise((resolve, reject) => {
      const userLocation = this.locationUserRepository.create(payload);
      this.locationUserRepository
        .save(userLocation)
        .then(async (createdUserLocation: any) => {
          return this.timerService
            .create(payload.lat, payload.lng, payload.user_id)
            .then(() => {
              this.socketGateway.server.emit('received-locations', {
                data: createdUserLocation,
              });
              resolve(createdUserLocation);
            })
            .catch((timerError) => {
              console.error('Error occurred while creating timer:', timerError);
              reject(timerError);
            });
        })
        .catch((saveError) => {
          console.error(
            'Error occurred while saving user location:',
            saveError,
          );
          reject(saveError);
        });
    });
  }

  // async create(payload: any): Promise<UserLocations[]> {
  //   const userLocation = this.locationUserRepository.create(payload);
  //   const createdUserLocation = await this.locationUserRepository.save(
  //     userLocation,
  //   );

  //   await this.timerService.create(payload.lat, payload.lng, payload.user_id)

  //   this.socketGateway.server.emit('received-locations', { data: createdUserLocation });

  //   return createdUserLocation;
  // }

  // async create(payload: any): Promise<UserLocations[]> {
  //   const createdLocations: UserLocations[] = [];

  //   for (let i = 1; i <= 200000; i++) {
  //     const userLocation = this.locationUserRepository.create(payload);
  //     const createdUserLocation : any= await this.locationUserRepository.save(userLocation);

  //     // Mengumpulkan semua lokasi yang dibuat
  //     createdLocations.push(createdUserLocation);

  //     // Mengirimkan informasi ke socket setiap kali membuat lokasi
  //     this.socketGateway.server.emit('received-locations', { data: createdUserLocation });
  //   }

  //   // Mengembalikan array semua lokasi yang dibuat
  //   return createdLocations;
  // }

  async update(id: string, payload: any): Promise<UserLocations> {
    const userLocation = await this.locationUserRepository.findOne({
      where: { id },
    });

    if (!userLocation)
      throw new HttpException(
        `Lokasi user dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    await this.locationUserRepository.update(id, payload);
    const updatedUser = await this.locationUserRepository.findOne({
      where: { id },
    });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const userLocation = await this.locationUserRepository.findOne({
      where: { id },
    });

    if (!userLocation)
      throw new HttpException(
        `Lokasi user dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    await this.locationUserRepository.delete(id);
  }
}
