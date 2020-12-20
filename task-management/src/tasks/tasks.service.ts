import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { v1 as uuidv1 } from 'uuid';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters( filterDto: GetTaskFilterDto ): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if ( status ) {
      tasks = tasks.filter( task => task.status === status );
    } else if ( search ) {
      tasks = tasks.filter( task =>
        task.title.includes( search )
        || task.description.includes( search )
      );
    }

    return tasks;
  }

  getTaskById( id: string ): Task {
    console.log('id', id)
    const found = this.tasks.find( task => task.id === id );

    if ( !found ) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask( createTaskDto: CreateTaskDto ): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push( task );
    return task;
  }

  deleteTask( id: string ): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter( task => task.id !== found.id );
  }

  updateTaskStatus( id: string, status: TaskStatus ): Task {
    const task = this.getTaskById( id );
    task.status = status;

    return task;
  }
}
