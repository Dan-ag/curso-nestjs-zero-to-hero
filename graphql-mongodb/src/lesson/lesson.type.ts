import { ID, ObjectType, Field } from '@nestjs/graphql';
import { StudentType } from 'src/student/student.type';
import { Column } from 'typeorm';

@ObjectType( 'Lesson' )
export class LessonType {
  @Field( type => ID )
  id: string;

  @Field()
  name: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field( type => [ StudentType ] )
  students: string[];
}

