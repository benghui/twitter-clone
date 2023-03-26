import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type) => User)
  @Exclude({ toPlainOnly: true })
  user: User;

  @Column({ length: 280 })
  tweet_body: string;

  @CreateDateColumn()
  createdDate: Date;
}
