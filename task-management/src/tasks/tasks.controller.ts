import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller( 'tasks' )
export class TasksController {
  constructor(
    private tasksService: TasksService
  ) { }

  // @Get()
  // getAllTasks( @Query( ValidationPipe ) filterDto: GetTaskFilterDto ): Task[] {
  //   if ( Object.keys( filterDto ) ) {
  //     return this.tasksService.getTaskWithFilters( filterDto );
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get( '/:id' )
  // getTaskById( @Param( 'id' ) id: string ): Task {
  //   console.log( 'id', id );
  //   return this.tasksService.getTaskById( id );
  // }

  // @Post()
  // @UsePipes( ValidationPipe )
  // createTask( @Body() createTaskDto: CreateTaskDto ): Task {
  //   return this.tasksService.createTask( createTaskDto );
  // }

  // @Delete( '/:id' )
  // deleteTaskById( @Param( 'id' ) id: string ): void {
  //   this.tasksService.deleteTask( id );
  // }

  // @Patch( '/:id/status' )
  // updateTaskStatus(
  //   @Param( 'id' ) id: string,
  //   @Body( 'status', TaskStatusValidationPipe ) status: TaskStatus
  // ): Task {
  //   return this.tasksService.updateTaskStatus( id, status );
  // }
}

