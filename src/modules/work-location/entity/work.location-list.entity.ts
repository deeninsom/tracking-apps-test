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

  @ManyToOne(() => WorkLocations)
  @JoinColumn({ name: 'location_id' })
  location_id: WorkLocations;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column()
  list_number: number;

  @CreateDateColumn( {type: 'timestamp' })
  public created_at: Date;

  @UpdateDateColumn({type: 'timestamp' })
  public updated_at: Date;
}
