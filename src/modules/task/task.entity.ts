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
export default class Tasks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => WorkLocations)
  @JoinColumn({ name: 'location_id' })
  location_id: WorkLocations;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
