// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     ManyToOne,
//     JoinColumn,
//   } from 'typeorm';
//   import Users from '../user/user.entity';
//   import WorkLocations from '../work-location/entity/work-location.entity';
  
//   @Entity()
//   export default class Timelines {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
  
//     @Column({ nullable: true })
//     location_name: string;

//     @Column({ nullable: true })
//     description: string;
  
//     @Column()
//     lat: string;
  
//     @Column()
//     lng: string;

//     @ManyToOne(() => Users)
//     @JoinColumn({ name: 'user_id' })
//     user_id: Users;
  
//     @CreateDateColumn()
//     public created_at: Date;
  
//     @UpdateDateColumn()
//     public updated_at: Date;
//   }
  