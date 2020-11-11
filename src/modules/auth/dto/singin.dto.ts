import { IsNotEmpty, IsString } from 'class-validator';

export class SinginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
