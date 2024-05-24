import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import Timers from './timer.entity';
import WorkLocationLists from '../work-location/entity/work.location-list.entity';
import { formateDateNow } from '../../utils/format-date.utils';
import { calculateDistance } from '../../utils/calculateDistance';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(Timers)
    private timerRepository: Repository<Timers>,


    @InjectRepository(WorkLocationLists)
    private workLocationListRepository: Repository<WorkLocationLists>
  ) { }

  async getDataLocation(
    userId: any,
    date: string,
  ) {
    const queryBuilder = this.timerRepository.createQueryBuilder('timer');
    queryBuilder.leftJoinAndSelect('timer.user_id', 'user_id')
    queryBuilder.andWhere('timer.user_id LIKE :user_id', { user_id: userId });
    // queryBuilder.andWhere('timer.inLocation LIKE :dates', { dates:  });
    queryBuilder.addOrderBy('timer.inLocation', 'ASC');
    queryBuilder.select([
      'timer.lat',
      'timer.lng',
      'timer.inLocation',
      'timer.inLocation',
      // 'user_id.id',
      // 'user_id.name',
      // 'user_id.username',
      // 'timer.created_at',
      // 'timer.updated_at'
    ]);

    if (date)
      queryBuilder.andWhere('DATE(timer.inLocation) LIKE :date', { date });

    const data = await queryBuilder.getMany();
    return data
  }

  async get(userId: string) {
    const queryBuilder = this.timerRepository.createQueryBuilder('timer');
    queryBuilder.leftJoinAndSelect('timer.user_id', 'user_id')
    queryBuilder.leftJoinAndSelect('timer.location_id', 'location_id')
    queryBuilder.andWhere('timer.user_id LIKE :user_id', { user_id: userId });
    queryBuilder.addOrderBy('timer.created_at', 'ASC');
    queryBuilder.select([
      'timer.id',
      'timer.inLocation',
      'user_id.id',
      'user_id.name',
      'user_id.username',
      'location_id.id',
      'location_id.label',
      'timer.created_at',
      'timer.updated_at'
    ]);
    const data = await queryBuilder.getMany();
    return data
  }

  async getResultTimer(userId: string) {
    const query = `
      SELECT 
        DATE_FORMAT(timer.created_at, '%Y-%m-%d') AS date,
        SUM(timer.duration) AS totalDuration,
        COUNT(timer.id) AS timerCount,
        'user_id', ANY_VALUE(timer.user_id) AS user_id,
        'location_id', ANY_VALUE(timer.location_id) AS location_id
      FROM 
        timers AS timer
        LEFT JOIN
        users AS user ON timer.user_id = user.id
        LEFT JOIN
        work_locations AS location ON timer.location_id = location.id
      WHERE
        timer.user_id = ?
      GROUP BY
        DATE_FORMAT(timer.created_at, '%Y-%m-%d')
    `;

    const data = await this.timerRepository.query(query, [userId]);
    return data;
  }

  // async create(lat: any, lng: any, userId: any, createdAt: any) {
  //   const queryLocation = this.workLocationListRepository.createQueryBuilder('location_list');
  //   queryLocation.leftJoinAndSelect('location_list.location_id', 'location_id');
  //   queryLocation.select(['location_list.id', 'location_list.lat', 'location_list.lng', 'location_id.id', 'location_list.list_number', 'location_id.range']);
  //   queryLocation.orderBy('location_list.list_number', 'ASC');
  //   const locations = await queryLocation.getMany();

  //   const formateDate = formateDateNow()
  //   let timerCreated = true;
  //   let locationId: any;

  //   await Promise.all(locations.map(async (location: any) => {
  //     const resultDistance = await calculateDistance({ lat, lng }, { lat: location.lat, lng: location.lng });
  //     if (resultDistance >= location.range) {
  //       timerCreated = false
  //     }
  //     // console.log(location)

  //     // timerCreated = true
  //     // if (timerCreated) {
  //     //   locationId = location.location_id.id;
  //     // }
  //     if (timerCreated === true) {
  //       locationId = location.location_id.id;
  //     }

  //     // console.log(resultDistance)
  //   }));


  //   if (timerCreated) {
  //     console.log(timerCreated)
  //     const createTimer = this.timerRepository.create({
  //       lat: lat,
  //       lng: lng,
  //       inLocation: createdAt,
  //       user_id: userId,
  //       location_id: locationId
  //     });
  //     // await this.timerRepository.save(createTimer);
  //   }
  // }

  async create(lat: any, lng: any, userId: any, createdAt: any) {
    const queryLocation = this.workLocationListRepository.createQueryBuilder('location_list');
    queryLocation.leftJoinAndSelect('location_list.location_id', 'location_id');
    queryLocation.select(['location_list.id', 'location_list.lat', 'location_list.lng', 'location_id.id', 'location_list.list_number', 'location_id.range']);
    queryLocation.orderBy('location_list.list_number', 'ASC');
    const locations: any = await queryLocation.getMany();


    let timerCreated = false; // Ubah inisialisasi ke false
    let locationId: any;

    // Periksa setiap lokasi
    for (const location of locations) {
      console.log(location)
      const resultDistance = await calculateDistance({ lat, lng }, { lat: location.lat, lng: location.lng });

      if (resultDistance <= location?.location_id?.range) { // Ganti operator ke <=
        timerCreated = true; // Jika jaraknya masuk ke dalam rentang, set timerCreated ke true
        locationId = location.location_id.id; // Simpan ID lokasi
        break; // Keluar dari loop karena sudah menemukan lokasi yang sesuai
      }
    }

    // Jika timerCreated masih false, berarti tidak ada lokasi yang sesuai, maka tidak membuat timer
    if (!timerCreated) {
      console.log("Jarak melebihi batas untuk semua lokasi");
      return; // Keluar dari fungsi
    }

    // Buat timer karena jaraknya masuk ke dalam rentang
    const createTimer = this.timerRepository.create({
      lat: lat,
      lng: lng,
      inLocation: createdAt,
      user_id: userId,
      location_id: locationId
    });

    await this.timerRepository.save(createTimer);
  }


}
