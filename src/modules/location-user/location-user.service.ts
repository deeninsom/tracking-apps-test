import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserLocations from './location-user.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocations)
    private locationUserRepository: Repository<UserLocations>,
  ) { }

  async get(userId: string, year: any, month: any, day: any, page: number, limit: number) {
    const queryBuilder =
      this.locationUserRepository.createQueryBuilder('lokasi_user');

    if (year) {
      queryBuilder.andWhere('YEAR(lokasi_user.created_at) = :created_at', {
        created_at: year,
      });
    }

    if (month) {
      queryBuilder.andWhere('MONTH(lokasi_user.created_at) = :created_at', {
        created_at: month,
      });
    }

    if (day) {
      queryBuilder.andWhere('DAY(lokasi_user.created_at) = :created_at', {
        created_at: day,
      });
    }

    if (userId) {
      queryBuilder.andWhere('lokasi_user.user_id LIKE :user_id', {
        user_id: userId,
      });
    }

    if (page <= 0) {
      page = 1;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      page,
      totalPages,
      totalRows: total,
    };
  }

  async getId(id: string): Promise<UserLocations> {
    const userLocation = await this.locationUserRepository.findOne({
      where: { id },
    });
    if (!userLocation)
      throw new HttpException(
        `Lokasi user dengan id ${id} tidak ditemukan !`,
        HttpStatus.NOT_FOUND,
      );

    return userLocation;
  }

  async create(payload: any): Promise<UserLocations[]> {
    const userLocation = this.locationUserRepository.create(payload);
    const createdUserLocation = await this.locationUserRepository.save(
      userLocation,
    );
    return createdUserLocation;
  }

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
