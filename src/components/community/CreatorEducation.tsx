
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreatorEducation } from '@/hooks/community/useCreatorEducation';
import { BookOpen, Play, Users, Clock, Star, Calendar, Award } from 'lucide-react';

interface CreatorEducationProps {
  searchQuery: string;
}

export const CreatorEducation: React.FC<CreatorEducationProps> = ({ searchQuery }) => {
  const {
    courses,
    myCourses,
    myEnrollments,
    workshops,
    loadingCourses,
    loadingWorkshops,
    enrollInCourse,
    registerForWorkshop,
  } = useCreatorEducation();

  const [selectedTab, setSelectedTab] = useState('courses');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creator Education</h2>
        <p className="text-crd-lightGray">
          Expand your skills with courses, workshops, and tutorials from expert creators
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full bg-crd-mediumGray">
          <TabsTrigger value="courses" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <BookOpen className="w-4 h-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="workshops" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Play className="w-4 h-4 mr-2" />
            Workshops
          </TabsTrigger>
          <TabsTrigger value="my-learning" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Star className="w-4 h-4 mr-2" />
            My Learning
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Award className="w-4 h-4 mr-2" />
            Certificates
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getSkillLevelColor(course.skill_level)} text-white`}>
                      {course.skill_level}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{course.rating_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg mb-2">{course.title}</CardTitle>
                  <p className="text-crd-lightGray text-sm line-clamp-2">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-crd-lightGray">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration_minutes || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-crd-lightGray">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollment_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-crd-green">
                      {course.is_free ? 'Free' : `$${course.price}`}
                    </div>
                    <Button
                      size="sm"
                      className="bg-crd-green hover:bg-green-600 text-black"
                      onClick={() => enrollInCourse.mutateAsync(course.id)}
                      disabled={enrollInCourse.isPending}
                    >
                      {enrollInCourse.isPending ? 'Enrolling...' : 'Enroll'}
                    </Button>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="mt-6">
          <div className="space-y-4">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-500 text-white">
                          {workshop.workshop_type}
                        </Badge>
                        {workshop.skill_level && (
                          <Badge className={`${getSkillLevelColor(workshop.skill_level)} text-white`}>
                            {workshop.skill_level}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-xl mb-2">{workshop.title}</CardTitle>
                      <p className="text-crd-lightGray">{workshop.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-crd-green mb-1">
                        {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
                      </div>
                      <div className="text-sm text-crd-lightGray">
                        {workshop.current_attendees}/{workshop.max_attendees || '∞'} registered
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-crd-lightGray">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(workshop.scheduled_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-crd-lightGray">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(workshop.duration_minutes)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="bg-crd-green hover:bg-green-600 text-black"
                      onClick={() => registerForWorkshop.mutateAsync(workshop.id)}
                      disabled={registerForWorkshop.isPending || workshop.status !== 'scheduled'}
                    >
                      {registerForWorkshop.isPending ? 'Registering...' : 'Register'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Learning Tab */}
        <TabsContent value="my-learning" className="mt-6">
          <div className="space-y-4">
            {myEnrollments.map((enrollment) => (
              <Card key={enrollment.id} className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg mb-1">
                        {enrollment.creator_courses?.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {enrollment.creator_courses?.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-crd-green font-semibold mb-1">
                        {enrollment.progress_percentage}% Complete
                      </div>
                      {enrollment.completed_at && (
                        <Badge className="bg-green-500 text-white">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Progress value={enrollment.progress_percentage} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-crd-lightGray">
                      Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </div>
                    <Button size="sm" className="bg-crd-green hover:bg-green-600 text-black">
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="mt-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="text-center py-12">
              <Award className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No certificates yet</h3>
              <p className="text-crd-lightGray">
                Complete courses to earn certificates and showcase your skills
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
