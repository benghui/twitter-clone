import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { Follower } from './follower.entity';
import { User } from '../auth/user.entity';
import { FollowersService } from './followers.service';

@Controller('users')
@UseGuards(AuthGuard())
export class FollowersController {
	constructor(private followersService: FollowersService) { }

	@Post('/:username/follow')
	addFollowUser(@Param('username') addUserToFollow: string, @GetUser() user: User): Promise<Follower> {
		return this.followersService.addFollowUser(addUserToFollow, user);
	}
}
