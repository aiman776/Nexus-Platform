import { useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

const CollaborationRequestCard = ({ request, onStatusUpdate }) => {
  const navigate = useNavigate();

  const investor = request.sender; // ✅ Backend se sender populated hoga

  if (!investor) return null;

  const handleAccept = () => {
    if (onStatusUpdate) onStatusUpdate(request._id, 'accepted');
  };

  const handleReject = () => {
    if (onStatusUpdate) onStatusUpdate(request._id, 'rejected');
  };

  const handleMessage = () => navigate(`/chat/${investor._id}`);
  const handleViewProfile = () => navigate(`/profile/investor/${investor._id}`);

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Declined</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="transition-all duration-300">
      <CardBody className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Avatar
              src={`https://ui-avatars.com/api/?name=${investor.username}&background=random`}
              alt={investor.username}
              size="md"
              className="mr-3"
            />
            <div>
              <h3 className="text-md font-semibold text-gray-900">{investor.username}</h3>
              <p className="text-sm text-gray-500">
                {request.createdAt
                  ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })
                  : ''}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">{request.message}</p>
        </div>
      </CardBody>

      <CardFooter className="border-t border-gray-100 bg-gray-50">
        {request.status === 'pending' ? (
          <div className="flex justify-between w-full">
            <div className="space-x-2">
              <Button variant="outline" size="sm" leftIcon={<X size={16} />} onClick={handleReject}>
                Decline
              </Button>
              <Button variant="success" size="sm" leftIcon={<Check size={16} />} onClick={handleAccept}>
                Accept
              </Button>
            </div>
            <Button variant="primary" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>
              Message
            </Button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>
              Message
            </Button>
            <Button variant="primary" size="sm" onClick={handleViewProfile}>
              View Profile
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CollaborationRequestCard;