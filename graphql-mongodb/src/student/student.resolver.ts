import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

// InputTypes
import { AssignStudentsToLessonInput } from '../lesson/assign-students-to-lesson-input';
import { CreateStudentInput } from './create-student.input';

// Services
import { LessonService } from '../lesson/lesson.service';
import { StudentService } from './student.service';

// Types
import { StudentType } from './student.type';

@Resolver( of => StudentType )
export class StudentResolver {
  constructor(
    private studentService: StudentService,
  ) { }

  @Query( returns => StudentType )
  student(
    @Args( 'id' ) id: string,
  ) {
    return this.studentService.getStudent( id );
  }

  @Query( returns => [ StudentType ] )
  students() {
    return this.studentService.getStudents();
  }

  @Mutation( returns => StudentType )
  async createStudent(
    @Args( 'createStudentInput' ) createStudentInput: CreateStudentInput
  ) {
    return this.studentService.createStudent( createStudentInput );
  }
}