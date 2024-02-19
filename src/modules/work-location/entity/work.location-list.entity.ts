import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import WorkLocations from './work-location.entity';

@Entity()
export default class WorkLocationLists {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkLocations, {
    onDelete: 'CASCADE',
    onUpdate: "CASCADE"
  })
  @JoinColumn({ name: 'location_id' })
  location_id: WorkLocations;

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @Column()
  list_number: number;

  @CreateDateColumn( {type: 'timestamp' })
  public created_at: Date;

  @UpdateDateColumn({type: 'timestamp' })
  public updated_at: Date;
}
