
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCreatorCommunity } from '@/hooks/community/useCreatorCommunity';
import { Trophy, Calendar, Users, DollarSign, Clock, Target } from 'lucide-react';

interface CreatorChallengesProps {
  searchQuery: string;
}

export const CreatorChallenges: React.FC<CreatorChallengesProps> = ({ searchQuery }) => {
  const { challenges, loadingChallenges, submitToChallenge } = useCreatorCommunity();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'judging': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'design': return Trophy;
      case 'speed': return Clock;
      case 'theme': return Target;
      case 'collaboration': return Users;
      default: return Trophy;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days left`;
    return `${hours} hours left`;
  };

  if (loadingChallenges) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creator Challenges</h2>
        <p className="text-crd-lightGray">
          Compete with other creators, showcase your skills, and win amazing prizes
        </p>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        {filteredChallenges.map((challenge) => {
          const Icon = getChallengeTypeIcon(challenge.challenge_type);
          const timeRemaining = calculateTimeRemaining(challenge.end_date);
          const progressPercentage = (challenge.submission_count / Math.max(challenge.participant_count, 1)) * 100;

          return (
            <Card key={challenge.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-crd-mediumGray rounded-lg">
                      <Icon className="w-6 h-6 text-crd-green" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl mb-1">{challenge.title}</CardTitle>
                      <p className="text-crd-lightGray text-sm">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(challenge.status)} text-white`}>
                    {challenge.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Challenge Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-crd-green mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{formatCurrency(challenge.prize_pool)}</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Prize Pool</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-white mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{challenge.participant_count}</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Participants</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-white mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="font-semibold">{challenge.submission_count}</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Submissions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{timeRemaining}</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Time Left</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-crd-lightGray">Submission Progress</span>
                    <span className="text-white">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Challenge Info */}
                <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ends {new Date(challenge.end_date).toLocaleDateString()}</span>
                  </div>
                  {challenge.skill_level && (
                    <Badge variant="outline" className="text-xs">
                      {challenge.skill_level}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {challenge.challenge_type}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {challenge.status === 'active' && (
                    <Button
                      className="bg-crd-green hover:bg-green-600 text-black"
                      onClick={() => setSelectedChallenge(challenge.id)}
                    >
                      Submit Entry
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    View Submissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="text-center py-12">
            <Trophy className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No challenges found</h3>
            <p className="text-crd-lightGray">
              {searchQuery
                ? `No challenges match "${searchQuery}"`
                : 'No active challenges at the moment. Check back soon!'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
