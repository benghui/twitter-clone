import { IsNotEmpty } from "class-validator";

export class CreateTweetDto {
	@IsNotEmpty()
	tweet_body: string;
}