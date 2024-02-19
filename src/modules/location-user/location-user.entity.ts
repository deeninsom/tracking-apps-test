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

  @Column({type: "double"})
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @Column({ type: 'tinyint', default: false })
  isActive: boolean;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
