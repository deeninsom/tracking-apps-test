import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import Tasks from './entity/task.entity';
import GroupTaskUsers from './entity/groupTaskUser.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,

    @InjectRepository(GroupTaskUsers)
    private groupTaskUsersRepository: Repository<GroupTaskUsers>,
  ) { }

  async get(page: number, limit: number) {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.leftJoinAndSelect('task.location_id', 'location_id')
    queryBuilder.orderBy('task.created_at', 'DESC')
    queryBuilder.select([
      'task.id',
      'task.name',
      'location_id.id',
      'location_id.label',
      'task.created_at',
      'task.updated_at'
    ]);

    let dataQuery = queryBuilder;
    if (limit && page) {
      const skip = (page - 1) * limit;
      dataQuery = dataQuery.take(limit).skip(skip);
    }
    const [data, total] = await dataQuery.getManyAndCount();
    const totalPages = limit && page ? Math.ceil(total / limit) : undefined;
    return {
      data: data || [],
      page: limit && page ? page : undefined,
      totalPages,
      totalRows: total,
    };
  }

  async getId(id: string) {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.leftJoinAndSelect('task.grouping', 'users')
    queryBuilder.leftJoinAndSelect('task.location_id', 'location_id')
    queryBuilder.leftJoinAndSelect('users.user_id', 'user_id')

    queryBuilder.select([
      'task.id',
      'task.name',
      'users.created_at',
      'users.updated_at',
      'user_id.id',
      'user_id.name',
      'location_id.id',
      'location_id.label',
      'task.created_at',
      'task.updated_at'
    ]);
    queryBuilder.andWhere('task.id = :id', { id: id });

    const data = await queryBuilder.getOne();

    return data || null
  }

  async create(payload: any): Promise<Tasks[]> {
    if (payload.users.length <= 0) {
      throw new HttpException(
        `Data list users belum belum di isi`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const task = this.taskRepository.create(payload);
    const createdTask: any = await this.taskRepository.save(task);

    const { users: user } = payload

    if (user && user.length > 0) {
      const userList = user.map((val: any) => { return { user_id: val.user_id, task_id: createdTask.id } })

      await this.groupTaskUsersRepository
        .createQueryBuilder()
        .insert()
        .values(userList)
        .execute()
    }

    return createdTask;
  }

  async update(id: string, payload: any): Promise<Tasks> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['location_id'] });

    if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)


    if (payload.users.length >= 0) {
      const checkUsers = await this.groupTaskUsersRepository.find(
        {
          where: {
            task_id: Like(`${id}`)
          }
        });

      if (payload.users.length < checkUsers.length) {
        const findTask = await this.groupTaskUsersRepository.find({
          where: {
            task_id: Like(`${task.id}`),
            user_id: Not(In(payload.users.map((val: any) => val.user_id)))
          },
          relations: ['user_id', 'task_id']
        });
        findTask.map(async (val: any) => {
          await this.groupTaskUsersRepository.delete(val.id);
        })
        console.log({
          text: 'Kurang dari current user',
          data: findTask
        })
      } else if (payload.users.length > checkUsers.length) {
        const findTask = await this.groupTaskUsersRepository.find({
          where: {
            task_id: Like(`${task.id}`),
            user_id: In(payload.users.map((val: any) => val.user_id))
          },
          relations: ['user_id', 'task_id']
        });

        const result = findTask.map((value) => value.user_id.id).toString()
        const checkData = payload.users.filter((val: any) => val.user_id !== result)
        const payloads: any = {
          task_id: '',
          user_id: ''
        }

        checkData.map(async (val: any) => {
          payloads.user_id = val.user_id
          payloads.task_id = id
          const results = this.groupTaskUsersRepository.create(payloads)
          await this.groupTaskUsersRepository.save(results)
        })
      }
    }

    if (payload.name !== task.name || payload.location_id !== task.location_id?.id) {
      await this.taskRepository.update(id, {
        name: payload.name,
        location_id: payload.location_id
      })
    }
    return await this.taskRepository.findOne({ where: { id } })
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.taskRepository.delete(task.id);
  }
}
