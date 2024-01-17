import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Users from '../user/user.entity';

@Entity()
export default class UserLocations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double', nullable: true })
  lat: number;

  @Column({ type: 'double', nullable: true })
  lng: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
