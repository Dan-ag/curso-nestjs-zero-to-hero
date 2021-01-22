import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
  id: 12,
  username: 'Test user'
};

const mockTaskRepository = () => ( {
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
} );

describe( 'TaskService', () => {
  let tasksService;
  let tasksRepository;

  beforeEach( async () => {
    const module = await Test.createTestingModule( {
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ],
    } ).compile();

    tasksService = await module.get<TasksService>( TasksService );
    tasksRepository = await module.get<TaskRepository>( TaskRepository );
  } );

  describe( 'getTask', () => {
    it( 'gets all tasks from the repository', async () => {
      tasksRepository.getTasks.mockResolvedValue( 'someValue' );

      expect( tasksRepository.getTasks ).not.toHaveBeenCalled();
      const filters: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };

      // call taskService.getTask()
      const result = await tasksService.getTasks( filters, mockUser );
      expect( tasksRepository.getTasks ).toHaveBeenCalled();
      expect( result ).toEqual( 'someValue' );
    } );
  } );

  describe( 'getTaskById', () => {
    it( 'calls taskRepository.findOne() and successffuly retrive and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test description' };
      tasksRepository.findOne.mockResolvedValue( mockTask );

      const result = await tasksService.getTaskById( 1, mockUser );
      expect( result ).toEqual( mockTask );

      expect( tasksRepository.findOne ).toHaveBeenCalledWith( {
        where: {
          id: 1,
          userId: mockUser.id
        }
      } );
    } );

    it( 'throws an error as task is not foiund', () => {
      tasksRepository.findOne.mockResolvedValue( null );
      expect( tasksService.getTaskById( 1, mockUser ) ).rejects.toThrow();
    } );
  } );

  describe( 'createTask', () => {
    it( 'calls taskRepository.create() and returns the result', async () => {
      tasksRepository.createTask.mockResolvedValue( 'someTask' );


      expect( tasksRepository.createTask ).not.toHaveBeenCalled();
      const mockNewTask: CreateTaskDto = { title: 'Test task', description: 'Test description' };
      const result = await tasksService.createTask( mockNewTask, mockUser );

      expect( tasksRepository.createTask ).toHaveBeenCalledWith( mockNewTask, mockUser );
      expect( result ).toEqual( 'someTask' );
    } );
  } );

  describe( 'deleteTask', () => {
    it( 'calls taskRepository.Delete() to delete a task', async () => {
      tasksRepository.delete.mockResolvedValue( { affected: 1 } );

      expect( tasksRepository.delete ).not.toHaveBeenCalled();
      await tasksService.deleteTask( 1, mockUser );
      expect( tasksRepository.delete ).toHaveBeenCalledWith( { id: 1, userId: mockUser.id } );
      // expect( result ).toEqual( { affected: 1 } );
    } );

    it( 'throw an error as task could not be found', () => {
      tasksRepository.delete.mockResolvedValue( { affected: 0 } );
      expect( tasksService.deleteTask( 1, mockUser ) ).rejects.toThrow();
    } );
  } );

  describe( 'updateTaskStatus', () => {
    it( 'calls taskRepository.updateTaskStatus() to delete a task', async () => {
      const save = jest.fn().mockResolvedValue( true );

      tasksService.getTaskById = jest.fn().mockResolvedValue( {
        status: TaskStatus.DONE,
        save,
      } );

      expect( tasksService.getTaskById ).not.toHaveBeenCalled();
      expect( save ).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus( 1, TaskStatus.DONE, mockUser );
      expect( tasksService.getTaskById ).toHaveBeenCalled();
      expect( save ).toHaveBeenCalled();
      expect( result.status ).toEqual( TaskStatus.DONE );
    } );
  } );
} );
