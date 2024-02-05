import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Tasks from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
  ) { }

  async get(userId: string, page: number, limit: number) {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.leftJoinAndSelect('task.user_id', 'user_id')

    if (userId) {
      queryBuilder.andWhere('task.user_id LIKE :user_id', { user_id: userId });
      queryBuilder.addOrderBy('task.created_at', 'ASC');
    }

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

  async getId(id: string): Promise<Tasks> {
    const task = await this.taskRepository.findOne({
      where: { id }
    });
    if (!task) throw new HttpException(`Task dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    return task;
  }

  async create(payload: any): Promise<Tasks[]> {
    const task = this.taskRepository.create(payload);
    const createdTask = await this.taskRepository.save(task);
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
