import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import UserLocations from './location-user.entity';
import { SocketGateway } from '../socket/socket.service';
import { TimerService } from '../timer/timer.service';
import { getAddress } from '../../utils/getAddressComponents';
import { formatTime } from '../../utils/formatTime';
import { calculateDuration } from '../../utils/calculateDuration';
import { calculateDistanceKm, calculateDistanceM } from '../../utils/calculateDistance';

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



    const dataResult: any = await queryBuilder.getMany();

    return {
      data: dataResult || []
    };
  }

  // async getLocationUsersV2(
  //   userId: string,
  //   date: string,
  //   sort: any,
  //   page: number,
  //   limit: number,
  // ) {
  //   const queryBuilder =
  //     this.locationUserRepository.createQueryBuilder('lokasi_user');

  //   if (userId) {
  //     queryBuilder.andWhere('lokasi_user.user_id LIKE :user_id', {
  //       user_id: userId,
  //     });
  //   }

  //   if (date)
  //     queryBuilder.andWhere('DATE(lokasi_user.created_at) = :date', { date });

  //   if (sort) {
  //     queryBuilder.orderBy('lokasi_user.created_at', sort);
  //   }

  //   if (page && limit) {
  //     queryBuilder.skip((page - 1) * limit).take(limit);
  //   }

  //   const [data, total] = await queryBuilder.getManyAndCount();

  //   const totalPages = limit && page ? Math.ceil(total / limit) : undefined;

  //   return {
  //     data: data || [],
  //     page: limit && page ? page : undefined,
  //     totalPages,
  //     totalRows: total,
  //   };
  // }

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

    const data= await queryBuilder.getManyAndCount();

    // Implementasi Douglas-Peucker Algorithm
    // data = data.map((locationUser: any) => {
    //   console.log(locationUser)
    //   // Terapkan algoritma Douglas-Peucker pada titik koordinat polyline
    //   locationUser.polylineCoordinates = this.douglasPeuckerAlgorithm(locationUser.polylineCoordinates);
    //   return locationUser;
    // });

    // const totalPages = limit && page ? Math.ceil(total / limit) : undefined;

    return {
      data: data || [],
      // page: limit && page ? page : undefined,
      // totalPages,
      // totalRows: total,
    };
  }

  douglasPeuckerAlgorithm(polylineCoordinates: any[]) {
    const epsilon = 0.0001; // Nilai epsilon untuk algoritma Douglas-Peucker
    const distance = (p1: any, p2: any) => {
      const dx = p1.latitude - p2.latitude;
      const dy = p1.longitude - p2.longitude;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const douglasPeuckerRecursive = (points: any[], first: number, last: number, dmax: number, result: any[]) => {
      if (last <= first + 1) {
        // Basis kasus: hanya ada dua titik, jadi jaraknya pasti nol
        return;
      }

      // Temukan titik terjauh
      let maxDistance = 0;
      let index = 0;
      for (let i = first + 1; i < last; i++) {
        const d = distance(points[i], points[first]);
        if (d > maxDistance) {
          maxDistance = d;
          index = i;
        }
      }

      if (maxDistance > dmax) {
        // Jika titik terjauh melebihi batas, tambahkan ke hasil
        result.push(points[index]);
        // Rekursif pada kedua sisi titik terjauh
        douglasPeuckerRecursive(points, first, index, dmax, result);
        douglasPeuckerRecursive(points, index, last, dmax, result);
      }
    };

    // Mulai dengan menambahkan titik awal dan akhir ke hasil
    const result = [polylineCoordinates[0]];
    // Rekursif Douglas-Peucker pada seluruh polyline
    douglasPeuckerRecursive(polylineCoordinates, 0, polylineCoordinates.length - 1, epsilon, result);
    // Tambahkan titik terakhir ke hasil
    result.push(polylineCoordinates[polylineCoordinates.length - 1]);

    return result;
  }

  async getLocationUsersV3(
    userId: string,
    date: string,
    sort: any
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

    const [data] = await queryBuilder.getManyAndCount();

    if (data.length > 0) {



      async function groupData(data: any) {
        const groupedData = [];
        const tempGroup = {
          time: "",
          data: [],
          status: "",
          locationStart: "",
          locationEnd: ""
        };

        const getLocation = {
          startLatitude: 0,
          startLongitude: 0,
          endLatitude: 0,
          endLongitude: 0
        }

        data.forEach((entry: any, index: any) => {
          if (index === 0 || entry.status !== data[index - 1].status) {
            if (tempGroup.data.length > 0) {
              groupedData.push({
                time: tempGroup.time,
                data: [...tempGroup.data],
                status: tempGroup.status
              });
              tempGroup.data = [];
            }
            tempGroup.time = entry.created_at;
            tempGroup.status = entry.status;
          }
          tempGroup.data.push({
            latitude: entry.lat,
            longitude: entry.lng
          });
        });

        if (tempGroup.data.length > 0) {
          groupedData.push({
            time: tempGroup.time,
            data: [...tempGroup.data],
            status: tempGroup.status
          });
        }

        groupedData.forEach((group, index) => {
          const startTime = new Date(group.time);
          const endTime = new Date(
            groupedData[index + 1]?.time || data[data.length - 1].created_at
          );
          const duration = calculateDuration(startTime, endTime);
          group.time = `${formatTime(startTime)} - ${formatTime(endTime)} (${duration})`;

          if (group.status === "moving") {
            let totalDistance = 0;
            for (let i = 0; i < group.data.length - 1; i++) {
              const { latitude: lat1, longitude: lon1 } = group.data[i];
              const { latitude: lat2, longitude: lon2 } = group.data[i + 1];
              totalDistance += calculateDistanceKm(lat1, lon1, lat2, lon2);
            }
            group.distance = totalDistance.toFixed(2);
            getLocation.startLatitude = group.data[0].latitude
            getLocation.startLongitude = group.data[0].longitude
            getLocation.endLatitude = group.data[group.data.length - 1].latitude
            getLocation.endLongitude = group.data[group.data.length - 1].longitude
          }
        });

        const result1 = await getAddress(getLocation.startLatitude, getLocation.startLongitude)
        const result2 = await getAddress(getLocation.endLatitude, getLocation.endLongitude)
        groupedData.forEach((item) => {
          if (item.status === 'moving') {
            item.locationStart = result1
            item.locationEnd = result2
          }
          item.locationStart = result1
        })

        return groupedData;
      }

      const result = await groupData(data);

      return {
        data: result || []
      };
    }
    return {
      data: []
    };
  }


  // async createLocationUserV2(
  //   userId: any,
  //   lat: any,
  //   lng: any,
  //   isActive: any,
  //   speed: any,
  // ): Promise<any> {
  //   try {
  //     const payload: any = {
  //       user_id: userId,
  //       lat: lat,
  //       lng: lng,
  //       isActive: isActive,
  //       speed: speed,
  //       status: ''
  //     }

  //     const findLastLocation = await this.locationUserRepository.findOne({
  //       where: {
  //         user_id: Like(userId)
  //       },
  //       order: {created_at: "DESC"},
  //       relations: ['users']
  //     })

  //     if(!findLastLocation) {
  //       console.log('user tidak ditemukan')
  //     }else{
  //       const filterDistance = calculateDistanceM(findLastLocation.lat, findLastLocation.lng, lat, lng)
  //       if(filterDistance <= 100){
  //         payload.status = 'still'
  //       }
  //       payload.status = 'moving'
  //     }
  //     const locationUser: any = this.locationUserRepository.create(payload);
  //     const newLocationUser = await this.locationUserRepository.save(
  //     locationUser,
  //     );
  //     this.timerService.create(lat, lng, userId)
  //     return newLocationUser;
  //   } catch (error) {
  //     return error
  //   }
  // }

  async createLocationUserV2(
    userId: any,
    lat: number,
    lng: number,
    isActive: boolean,
    speed: number,
  ): Promise<any> {
    const payload: any = {
      user_id: userId,
      lat: lat,
      lng: lng,
      isActive: isActive,
      speed: speed,
      status: ''
    }
    console.log(payload.user_id)

    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    const findLastLocation = await this.locationUserRepository.findOne({
      where: {
        user_id: Like(payload.user_id),
        created_at: Between(startOfDay, endOfDay),
      },
      order: { created_at: "DESC" },
    })

    if (!findLastLocation) {
      payload.status = 'still'
    } else {
      const filterDistance = calculateDistanceM(findLastLocation.lat, findLastLocation.lng, lat, lng)
      if (filterDistance >= 50) {
        payload.status = 'moving'
      }else{ 
        payload.status = 'still'
      }
    }

    const locationUser: any = this.locationUserRepository.create(payload);
    const newLocationUser = await this.locationUserRepository.save(
      locationUser,
    );
    this.timerService.create(lat, lng, userId)
    return newLocationUser;
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

  // formatTime(date: Date): string {
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
  //   const formattedMinutes = minutes.toString().padStart(2, '0'); // Pad minutes with leading zero if needed
  //   return `${formattedHours}:${formattedMinutes} ${ampm}`;
  // }

  // calculateDuration(startDate: Date, endDate: Date): string {
  //   if (!startDate || !endDate) {
  //     return '';
  //   }

  //   const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  //   const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
  //   const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

  //   return `${hours}hr ${minutes}min`;
  // }
}
