import { IsID } from "@shared/custom-validators/is-id.decorator";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsID()
  fatherTaskId?: number;
}