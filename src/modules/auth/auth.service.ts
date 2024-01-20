import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Users from '../user/user.entity';
import {
  LoginDto,
  RegisterDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) { }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ id: string; name: string; role: string; jwt_token: string }> {
    const {name, phone, address, password } = registerDto;
    await this.validateEmailUniqueness(name);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      password: hashedPassword,
      phone,
      address,
    });
    const result = await this.userRepository.save(user);
    const findUser = await this.userRepository.findOne({
      where: {
        id: result.id,
      },
    });

    const payload = { id: findUser.id, name: findUser.name };
    const token = this.jwtService.sign(payload);

    user.jwt_token = token;
    await this.userRepository.save(user);

    return { id: user.id, name, role: user.role, jwt_token: token };
  }

  async login(loginDto: LoginDto): Promise<{
    id: string;
    name: string;
    role: string;
    jwt_token: string;
  }> {
    const { name, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        name,
      },
    });

    if (!user)
      throw new HttpException('Username tidak ditemukan !', HttpStatus.NOT_FOUND);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new HttpException(
        'Password tidak cocok !',
        HttpStatus.UNAUTHORIZED,
      );


    const payload = { id: user.id, name: user.name };
    const token = this.jwtService.sign(payload);

    user.jwt_token = token;
    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      jwt_token: token,
    };
  }

  async logout(token: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        jwt_token: Like(`%${token}%`),
      },
    });

    if (!user)
      throw new HttpException('User tidak ditemukan !', HttpStatus.NOT_FOUND);

    await this.userRepository.update(user.id, { jwt_token: null });
    return true;
  }

  private async validateEmailUniqueness(name: string): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: {
        name: name,
      },
    });

    if (existingUser) {
      throw new HttpException(
        'Email sudah terdaftar !',
        HttpStatus.BAD_REQUEST,
      );
    }
    return existingUser;
  }
}
