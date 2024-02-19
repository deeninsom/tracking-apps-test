import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    queryBuilder.orderBy('task.created_at', 'DESC')
    queryBuilder.select([
      'task.id',
      'task.name',
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
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.taskRepository.update(id, payload);
    const updatedTask = await this.taskRepository.findOne({ where: { id } });

    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.taskRepository.delete(id);
  }
}
