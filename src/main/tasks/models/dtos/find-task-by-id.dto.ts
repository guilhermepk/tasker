import { IsID } from "@shared/custom-validators/is-id.decorator";
import { IsNotEmpty } from "class-validator";

export class FindTaskByIdDto {
  @IsNotEmpty()
  @IsID()
  id: number;
}