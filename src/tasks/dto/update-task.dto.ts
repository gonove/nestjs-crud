import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// we don't need to modify nothing here cause we are extending from CreateTaskDto :D
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
