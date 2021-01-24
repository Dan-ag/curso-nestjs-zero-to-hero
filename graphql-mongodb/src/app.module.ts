import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';

// Entities
import { Lesson } from './lesson/lesson.entity';
import { Student } from './student/student.entity';


@Module( {
  imports: [
    TypeOrmModule.forRoot( {
      type: 'mongodb',
      url: 'mongodb://localhost/school',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [
        Lesson,
        Student,
      ]
    } ),
    GraphQLModule.forRoot( {
      autoSchemaFile: true,
    } ),
    LessonModule,
    StudentModule,
  ],
  controllers: [],
  providers: [

  ],
} )
export class AppModule { }
