import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import Timers from './timer.entity';
import WorkLocationLists from '../work-location/entity/work.location-list.entity';
import Tasks from '../task/entity/task.entity';
import { formateDateNow } from '../../utils/format-date.utils';
import { calculateDistance } from '../../utils/calculateDistance.utils';
import GroupTaskUsers from '../task/entity/groupTaskUser.entity';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(Timers)
    private timerRepository: Repository<Timers>,

    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,

    @InjectRepository(GroupTaskUsers)
    private groupTaskRepository: Repository<GroupTaskUsers>,

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

    const findTask = await this.groupTaskRepository.findOne({
      where: {
        user_id: Like(`${userId}`)
      },
      relations: ['user_id']
    })

    if (findTask) {
      const queryTask = this.taskRepository.createQueryBuilder('task');
      queryTask.leftJoinAndSelect('task.location_id', 'location_id');
      queryTask.select(['task.id', 'location_id.id']);
      const tasks = await queryTask.getMany();
      const locationIds = tasks.map((task) => task.location_id.id);

      const queryLocation = this.workLocationListRepository.createQueryBuilder('location_list');
      queryLocation.leftJoinAndSelect('location_list.location_id', 'location_id');
      queryLocation.where('location_id.id IN (:...locations_id)', { locations_id: locationIds });
      queryLocation.select(['location_list.id', 'location_list.lat', 'location_list.lng', 'location_id.id', 'location_list.list_number']);
      queryLocation.orderBy('location_list.list_number', 'ASC');
      const locations = await queryLocation.getMany();
      const formateDate = formateDateNow()
      let timerCreated = false;

      await Promise.all(locations.map(async (location) => {
        const resultDistance = await calculateDistance({ lat, lng }, location);
        if (resultDistance <= 5) {
          timerCreated = true
        }
      }));

      const locationId: any = locations[0].location_id?.id

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

  // async create(lat: any, lng: any, userId: any) {
  //   const queryTask = this.taskRepository.createQueryBuilder('task');
  //   queryTask.leftJoinAndSelect('task.location_id', 'location_id');
  //   queryTask.select(['task.id', 'location_id.id']);

  //   const tasks = await queryTask.getMany();
  //   const locationIds = tasks.map((task) => task.location_id.id);

  //   const queryLocation = this.workLocationListRepository.createQueryBuilder('location_list');
  //   queryLocation.leftJoinAndSelect('location_list.location_id', 'location_id');
  //   queryLocation.where('location_id.id IN (:...locations_id)', { locations_id: locationIds });
  //   queryLocation.select(['location_list.id', 'location_list.lat', 'location_list.lng', 'location_id.id', 'location_list.list_number']);
  //   queryLocation.addOrderBy('location_list.list_number', 'ASC')

  //   const locations = await queryLocation.getMany();

  //   await Promise.all(locations.map(async (location) => {
  //     const resultDistance = await this.calculateDistance({lat, lng}, location);
  //     // if (resultDistance >= 5) {
  //     //   console.log('Lebih dari 5 meter, hasil ' + resultDistance + ' m', JSON.stringify({location_id: location.location_id.id, lat: location.lat, lng: location.lng}));
  //     // } 
  //     // else {
  //     //   console.log('Dalam jangkauan, hasil ' + resultDistance + ' m', JSON.stringify({location_id: location.location_id.id, lat: location.lat, lng: location.lng}));
  //     // }
  //     if(resultDistance <= 2){
  //       console.log('Dalam jangkauan, hasil ' + resultDistance + ' m', JSON.stringify({location_id: location.location_id.id, lat: location.lat, lng: location.lng, number: location.list_number}));
  //     }
  //   }));
  // }


  // private async calculateDistance(dataUser: any, dataLocation: any) {
  //   const lat1 = dataUser.lat;
  //   const lng1 = dataUser.lng;
  //   const lat2 = dataLocation.lat;
  //   const lng2 = dataLocation.lng;

  //   // Rumus haversine untuk menghitung jarak antara dua titik
  //   const R = 6371e3; // Radius bumi dalam meter
  //   const φ1 = lat1 * Math.PI / 180; // Convert ke radian
  //   const φ2 = lat2 * Math.PI / 180; // Convert ke radian
  //   const Δφ = (lat2 - lat1) * Math.PI / 180; // Selisih lintang dalam radian
  //   const Δλ = (lng2 - lng1) * Math.PI / 180; // Selisih bujur dalam radian

  //   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) *
  //     Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   const distance = R * c; // Jarak dalam meter
  //   return Math.round(distance);
  // }

  //   async getId(id: string): Promise<Timers> {
  //     const task = await this.taskRepository.findOne({
  //       where: { id }
  //     });
  //     if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

  //     return task;
  //   }

  //   async create(payload: any): Promise<Timers[]> {

  //     const task = this.taskRepository.create(payload);
  //     const createdTask = await this.taskRepository.save(task);
  //     return createdTask;
  //   }

  //   async update(id: string, payload: any): Promise<Timers> {
  //     const task = await this.taskRepository.findOne({ where: { id } });

  //     if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

  //     await this.taskRepository.update(id, payload);
  //     const updatedTask = await this.taskRepository.findOne({ where: { id } });

  //     return updatedTask;
  //   }

  //   async delete(id: string): Promise<void> {
  //     const task = await this.taskRepository.findOne({ where: { id } });

  //     if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

  //     await this.taskRepository.delete(id);
  //   }
}
