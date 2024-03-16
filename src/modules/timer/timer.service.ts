import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(lat: any, lng: any, userId: any) {


    const queryLocation = this.workLocationListRepository.createQueryBuilder('location_list');
    queryLocation.leftJoinAndSelect('location_list.location_id', 'location_id');
    queryLocation.select(['location_list.id', 'location_list.lat', 'location_list.lng', 'location_id.id', 'location_list.list_number', 'location_id.range']);
    queryLocation.orderBy('location_list.list_number', 'ASC');
    const locations = await queryLocation.getMany();

    const formateDate = formateDateNow()
    let timerCreated = false;
    let locationId: any;

    await Promise.all(locations.map(async (location: any) => {
      const resultDistance = await calculateDistance({ lat, lng }, { lat: location.lat, lng: location.lng });
      if (resultDistance >= location.range) {
        timerCreated = false
      }

      timerCreated = true
      if (timerCreated) {
        locationId = location.location_id.id;
      }
    }));

    if (timerCreated) {
      const createTimer = this.timerRepository.create({
        inLocation: formateDate,
        user_id: userId,
        location_id: locationId
      });
      await this.timerRepository.save(createTimer);
    }
  }

}
