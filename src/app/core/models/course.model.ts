export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  instructor: string;
  price: number;
  status: boolean;
  duration: number;
  thumbnail: string;
  studentsCount: number;
  rating: number;
  createdAt: number;
}

export type CreateCourseDto = Omit<Course, 'id' | 'createdAt' | 'studentsCount' | 'rating'>;
export type UpdateCourseDto = Partial<CreateCourseDto>;
