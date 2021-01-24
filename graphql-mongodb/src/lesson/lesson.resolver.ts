import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson-input';
import { StudentType } from 'src/student/student.type';
import { CreateLessonInput } from './lesson.input';
import { LessonService } from './lesson.service';
import { LessonType } from './lesson.type';
import { Lesson } from './lesson.entity';
import { StudentService } from 'src/student/student.service';

@Resolver( of => LessonType )
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService
  ) { }

  @Query( returns => LessonType )
  lesson(
    @Args( 'id' ) id: string,
  ) {
    return this.lessonService.getLesson( id );
  }

  @Query( returns => [ LessonType ] )
  lessons() {
    return this.lessonService.getLessons();
  }

  @Mutation( returns => LessonType )
  createLesson(
    @Args( 'createLessonInput' ) createLessonInput: CreateLessonInput,
  ) {
    return this.lessonService.createLesson( createLessonInput );
  }

  @Mutation( returns => LessonType )
  assignStudentsToLesson(
    @Args( 'assignStudentsToLessonInput' ) assignStudentsToLessonInput: AssignStudentsToLessonInput
  ) {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    return this.lessonService.assignStudentsToLesson( lessonId, studentIds );
  }

  @ResolveField()
  async students( @Parent() lesson: Lesson ) {
    return this.studentService.getManyStudents( lesson.students );
  }

}