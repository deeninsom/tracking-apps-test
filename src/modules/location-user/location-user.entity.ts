import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import Users from '../user/user.entity';

@Entity()
@Index('idx_user_id', ['user_id'])
export default class UserLocations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  location_json: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
