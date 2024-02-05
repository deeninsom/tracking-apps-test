import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import WorkLocationLists from './work.location-list.entity';
import Tasks from 'src/modules/task/task.entity';

@Entity()
export default class WorkLocations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column({ type: 'tinyint', default: false })
  isActive: boolean

  @OneToMany(() => WorkLocationLists, (location) => location.location_id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  location_list: WorkLocationLists[];

  @OneToMany(() => Tasks, (task) => task.location_id, {
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
