import { EntityRepository, Repository } from "typeorm";
import { Follower } from "./follower.entity";
import { User } from "../auth/user.entity";

@EntityRepository(Follower)
export class FollowersRepository extends Repository<Follower> {
	async addFollowUser(followingUser: User, user: User): Promise<Follower> {
		const follow = this.create({
			followers_id: user.id,
			following_id: followingUser.id,
			followers: user,
			following: followingUser,
		});

		await this.save(follow);

		return follow;
	}
}
