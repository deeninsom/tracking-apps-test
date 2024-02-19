import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import Tasks from './task.entity';
import Users from 'src/modules/user/user.entity';

@Entity()
export default class GroupTaskUsers {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users, {
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'user_id' })
    user_id: Users;

    @ManyToOne(() => Tasks, {
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'task_id' })
    task_id: Tasks;

    @CreateDateColumn()
    public created_at: Date;
  
    @UpdateDateColumn()
    public updated_at: Date;

}