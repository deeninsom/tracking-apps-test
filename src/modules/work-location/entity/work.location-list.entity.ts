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
  
    @Column({ type: 'double', default: 0 })
    lat: number;
  
    @Column({ type: 'double', default: 0 })
    lng: number;
  
    @CreateDateColumn()
    public created_at: Date;
  
    @UpdateDateColumn()
    public updated_at: Date;
  }
  