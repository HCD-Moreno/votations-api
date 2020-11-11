import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsBoolean()
    changeLater: boolean    
}