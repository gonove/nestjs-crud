import { CreateTaskDto } from '../dto/create-task.dto';

export class Task {
  taskId: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;

  static instanceFromDynamoDBObject(data: any): Task {
    const task = new Task();

    // maybe a simplest way to do this
    Object.assign(task, {
      taskId: data?.taskId?.S,
      title: data?.title?.S,
      description: data?.description?.S,
      createdAt: data?.createdAt ? new Date(Number(data.createdAt.N)) : null,
      updatedAt: data?.updatedAt ? new Date(Number(data.updatedAt.N)) : null,
    });

    return task;
  }

  static instanceFromDTO(data: CreateTaskDto) {
    const task = new Task();

    task.taskId = Date.now().toString();
    task.title = data.title;
    task.description = data.description;
    task.createdAt = new Date();

    return task;
  }
}
