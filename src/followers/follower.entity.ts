import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class Follower {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	followers_id: string;

	@Column()
	following_id: string;

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date

	@ManyToOne((_type) => User, (user) => user.following)
	@JoinColumn({ name: 'followers_id' })
	followers: User;

	@ManyToOne((_type) => User, (user) => user.followers)
	@JoinColumn({ name: 'following_id' })
	following: User;
}
