// docs: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html
import { Injectable } from '@nestjs/common';
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksInteraction {
  private readonly tableName = 'tasks';
  private readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-1',
    });
  }

  async upsertOne(task: Task) {
    const taskObject: Record<string, AttributeValue> = {
      taskId: {
        S: task.taskId,
      },
      title: {
        S: task.title,
      },

      createdAt: {
        N: task.createdAt.getTime().toString(),
      },
    };

    if (task.updatedAt) {
      taskObject.updatedAt = {
        N: task.updatedAt.getTime().toString(),
      };
    }

    if (task.description) {
      taskObject.description = {
        S: task.description,
      };
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: taskObject,
    });

    try {
      await this.client.send(command);
      return task;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const response: Task[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const result = await this.client.send(command);

    if (result.Items) {
      result.Items.forEach((item) => {
        response.push(Task.instanceFromDynamoDBObject(item));
      });
    }

    return response;
  }

  async findOne(taskId: string) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        taskId: {
          S: taskId,
        },
      },
    });

    const result = await this.client.send(command);
    if (result.Item) {
      return Task.instanceFromDynamoDBObject(result.Item);
    }

    return undefined;
  }

  async deleteOne(taskId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        taskId: {
          S: taskId,
        },
      },
      ReturnValues: 'ALL_OLD', // for know if it was deleted
      ReturnConsumedCapacity: 'TOTAL',
    });

    const result = await this.client.send(command);
    if (result.Attributes) {
      return true;
    }

    return false;
  }
}
