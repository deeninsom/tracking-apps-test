import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Users from '../user/user.entity';
import WorkLocations from '../work-location/entity/work-location.entity';

@Entity()
export default class Timers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 2 })
  duration: number;

  @Column()
  inLocation: string;

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => WorkLocations, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: 'location_id' })
  location_id: WorkLocations;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
