import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import UserLocations from './location-user.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocations)
    private locationUserRepository: Repository<UserLocations>,
  ) { }

  async get(userId: string, createdAt: any) {
    const whereConditions: any = {}
    
    if (userId) {
      whereConditions.user_id = { id: userId }
    }

    if (createdAt) {
      const timestampCreatedAt = new Date(`${createdAt}`).toISOString();

      whereConditions.created_at = timestampCreatedAt
    }

    console.log(whereConditions)

    const userLocations = await this.locationUserRepository.find({
      where: whereConditions,
      order: { 'created_at': 'DESC' }
    });
    
    console.log(userLocations)
    return userLocations
  }

  async getId(id: string): Promise<UserLocations> {
    const userLocation = await this.locationUserRepository.findOne({
      where: { id }
    });
    if (!userLocation) throw new HttpException(`Lokasi user dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    return userLocation;
  }

  async create(payload: any): Promise<UserLocations[]> {
    const userLocation = this.locationUserRepository.create(payload);
    const createdUserLocation = await this.locationUserRepository.save(userLocation);
    return createdUserLocation;
  }

  async update(id: string, payload: any): Promise<UserLocations> {
    const userLocation = await this.locationUserRepository.findOne({ where: { id } });

    if (!userLocation) throw new HttpException(`Lokasi user dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.locationUserRepository.update(id, payload);
    const updatedUser = await this.locationUserRepository.findOne({ where: { id } });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const userLocation = await this.locationUserRepository.findOne({ where: { id } });

    if (!userLocation) throw new HttpException(`Lokasi user dengan id ${id} tidak ditemukan !`, HttpStatus.NOT_FOUND)

    await this.locationUserRepository.delete(id);
  }
}
