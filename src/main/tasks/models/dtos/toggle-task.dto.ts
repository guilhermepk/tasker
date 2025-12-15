import { IsID } from "@shared/custom-validators/is-id.decorator";

export class ToggleTaskDto {
  @IsID()
  id: number;
}