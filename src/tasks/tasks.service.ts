import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksInteraction } from './tasks.interaction';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksInteraction) {}

  create(createTaskDto: CreateTaskDto) {
    return this.repository.upsertOne(Task.instanceFromDTO(createTaskDto)); // createTaskDto extract the attributes from instanceFromDTO and create a new instance of task
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.repository.findOne(id);

    if (updateTaskDto.title) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description) {
      task.description = updateTaskDto.description;
    }

    task.updatedAt = new Date();
    return this.repository.upsertOne(task);
  }

  remove(id: string) {
    return this.repository.deleteOne(id);
  }
}
