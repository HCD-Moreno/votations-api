import { IsString } from "class-validator";
import { VotationType } from "../enums/type.enum";

export class CreateVotationDto {
  title: string;

  description: string;

  type: VotationType;
}
