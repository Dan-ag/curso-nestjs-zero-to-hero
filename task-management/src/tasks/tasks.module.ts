import { Module } from '@nestjs/common';

// Modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

// Repositories
import { TaskRepository } from './task.repository';

// TasksController
import { TasksController } from './tasks.controller';

// Services
import { TasksService } from './tasks.service';

@Module( {
  imports: [
    TypeOrmModule.forFeature( [ TaskRepository ] ),
    AuthModule,
  ],
  controllers: [ TasksController ],
  providers: [ TasksService ]
} )
export class TasksModule { }
