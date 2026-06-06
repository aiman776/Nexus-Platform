import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const InvestorCard = ({ investor, showActions = true }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => navigate(`/profile/investor/${investor._id}`);
  const handleMessage = (e) => {
    e.stopPropagation();
    navigate(`/chat/${investor._id}`);
  };

  return (
    <Card hoverable className="transition-all duration-300 h-full" onClick={handleViewProfile}>
      <CardBody className="flex flex-col">
        <div className="flex items-start">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${investor.name}&background=random`}
            alt={investor.name}
            size="lg"
            className="mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{investor.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Investor • {investor.totalInvestments} investments</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {investor.investmentStage?.map((stage, i) => (
                <Badge key={i} variant="secondary" size="sm">{stage}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Investment Interests</h4>
          <div className="flex flex-wrap gap-2">
            {investor.investmentInterests?.map((interest, i) => (
              <Badge key={i} variant="primary" size="sm">{interest}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{investor.bio}</p>
        </div>

        <div className="mt-3">
          <span className="text-xs text-gray-500">Investment Range</span>
          <p className="text-sm font-medium text-gray-900">
            {investor.minimumInvestment} - {investor.maximumInvestment}
          </p>
        </div>
      </CardBody>

      {showActions && (
        <CardFooter className="border-t border-gray-100 bg-gray-50 flex justify-between">
          <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>
            Message
          </Button>
          <Button variant="primary" size="sm" rightIcon={<ExternalLink size={16} />} onClick={handleViewProfile}>
            View Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default InvestorCard;