import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import WorkLocations from '../../work-location/entity/work-location.entity';
import GroupTaskUsers from './groupTaskUser.entity';

@Entity()
export default class Tasks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => WorkLocations, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: 'location_id' })
  location_id: WorkLocations;

  @OneToMany(() => GroupTaskUsers, (groupList) => groupList.task_id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  grouping: GroupTaskUsers[];

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
