import { IsID } from "@shared/custom-validators/is-id.decorator";
import { IsNotEmpty } from "class-validator";

export class DeleteTaskDto {
  @IsNotEmpty()
  @IsID()
  id: number;
}