import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsNotEmpty } from "class-validator";
import { IsID } from "@shared/custom-validators/is-id.decorator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNotEmpty()
  @IsID()
  id: number;
}
