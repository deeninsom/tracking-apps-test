import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import WorkLocationLists from './work.location-list.entity';

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

  @Column({type: "int"})
  range: number;

  @Column({type: "enum", enum: ['paid', 'unpaid'], default: 'unpaid'})
  payment_status: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
