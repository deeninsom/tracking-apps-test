import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import Users from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) { }

  async get(page: number, limit: number) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
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

  async getId(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new HttpException(`User dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    return user;
  }

  async create(payload: any): Promise<Users[]> {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;

    const user = this.userRepository.create(payload);
    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async update(id: string, payload: any): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new HttpException(`User dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      payload.password = hashedPassword;
    }

    await this.userRepository.update(id, payload);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new HttpException(`User dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.userRepository.delete(id);
  }
}
