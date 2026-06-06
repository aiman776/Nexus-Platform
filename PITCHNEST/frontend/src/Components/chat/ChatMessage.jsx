import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';

const ChatMessage = ({ message, isCurrentUser }) => {
  const senderName = message.sender?.username || 'User';
  const senderInitial = senderName.charAt(0).toUpperCase();

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      
      {!isCurrentUser && (
        <Avatar
          src={`https://ui-avatars.com/api/?name=${senderName}&background=random`}
          alt={senderName}
          size="sm"
          className="mr-2 self-end"
        />
      )}

      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>

        <span className="text-xs text-gray-500 mt-1">
          {message.createdAt
            ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
            : 'Just now'}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar
          src={`https://ui-avatars.com/api/?name=${senderName}&background=random`}
          alt={senderName}
          size="sm"
          className="ml-2 self-end"
        />
      )}
    </div>
  );
};

export default ChatMessage;