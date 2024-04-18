import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksInteraction } from './tasks.interaction';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksInteraction],
})
export class TasksModule {}
