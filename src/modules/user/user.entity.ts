import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import UserLocations from '../location-user/location-user.entity';
import Tasks from '../task/task.entity';


export enum Role {
  pengawas = 'pengawas',
  kordinator = 'kordinator',
  admin = 'admin',
}

@Entity()
export default class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'simple-array', nullable: true })
  image_url: string[];

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column({ nullable: true })
  jwt_token: string;

  @Column({ type: 'enum', enum: Role })
  role: string;

  @OneToMany(() => UserLocations, (location) => location.user_id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  location_users: UserLocations[];

  @OneToMany(() => Tasks, (task) => task.user_id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tasks: Tasks[];


  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
