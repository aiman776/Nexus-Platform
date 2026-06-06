import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useAuth } from '../../store/auth';

const ChatUserList = ({ conversations, onSelectConversation }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="bg-white border-r border-gray-200 w-full md:w-64 overflow-y-auto">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-800 mb-4">Messages</h2>

        <div className="space-y-1">
          {conversations.length > 0 ? (
            conversations.map(conversation => {
              // ✅ Backend se aaya data — members array mein dono users hain
              const otherMember = conversation.members?.find(
                m => m._id !== currentUser._id
              );

              if (!otherMember) return null;

              const isActive = false; // baad mein active conversation track karein ge

              return (
                <div
                  key={conversation._id}
                  className={`px-4 py-3 flex cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${otherMember.username}&background=random`}
                    alt={otherMember.username}
                    size="md"
                    className="mr-3 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherMember.username}
                      </h3>
                      {conversation.updatedAt && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: false })}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-600 truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="primary" size="sm" rounded>
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatUserList;