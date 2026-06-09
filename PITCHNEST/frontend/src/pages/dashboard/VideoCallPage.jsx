import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useAuth } from '../../store/auth';
import './VideoCallPage.css';

// ✅ Socket ek baar banao
const socket = io('http://localhost:1000');

const VideoCallPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');

  const iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    const startCall = async () => {
      try {
        // ✅ Camera + mic access
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = localStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // ✅ Peer connection banao
        peerConnectionRef.current = new RTCPeerConnection(iceServers);

        // ✅ Local tracks add karo
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStream);
        });

        // ✅ Remote stream receive karo
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setConnected(true);
            setCallStatus('Connected');
          }
        };

        // ✅ ICE candidates bhejo
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomId);
          }
        };

        // ✅ Room join karo - dusre ko notification jaayegi
        socket.emit('join-room', roomId, user?._id);
        setCallStatus('Waiting for other person...');

        // ✅ Jab dusra user join kare - offer bhejo
        socket.on('user-connected', async (userId) => {
          console.log('User connected:', userId);
          setCallStatus('Other person joined! Connecting...');
          try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', offer, roomId);
          } catch (err) {
            console.error('Offer error:', err);
          }
        });

        // ✅ Offer receive karo - answer bhejo
        socket.on('offer', async (offer) => {
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(offer)
            );
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('answer', answer, roomId);
          } catch (err) {
            console.error('Answer error:', err);
          }
        });

        // ✅ Answer receive karo
        socket.on('answer', async (answer) => {
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (err) {
            console.error('Set answer error:', err);
          }
        });

        // ✅ ICE candidate receive karo
        socket.on('ice-candidate', async (candidate) => {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (err) {
            console.error('ICE error:', err);
          }
        });

        // ✅ Dusra user disconnect ho
        socket.on('user-disconnected', () => {
          setConnected(false);
          setCallStatus('Other person left the call');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });

      } catch (err) {
        console.error('Camera/mic error:', err);
        alert('Camera ya microphone access nahi mila!');
      }
    };

    startCall();

    // ✅ Cleanup
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socket.off('user-connected');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-disconnected');
    };
  }, [roomId]);

  // ✅ Mic toggle
  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  // ✅ Camera toggle
  const toggleCam = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  };

  // ✅ Call end
  const endCall = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    peerConnectionRef.current?.close();
    socket.emit('leave-room', roomId, user?._id);
    navigate(-1);
  };

  return (
    <div className="video-call-page">

      {/* Status bar */}
      <div className="call-status-bar">
        <span className={`status-dot ${connected ? 'green' : 'yellow'}`}></span>
        <p>{callStatus}</p>
      </div>

      <div className="video-grid">
        {/* Remote Video */}
        <div className="video-box remote">
          <video ref={remoteVideoRef} autoPlay playsInline />
          {!connected && (
            <div className="waiting-text">
              <div className="waiting-spinner"></div>
              <p>Waiting for other person to join...</p>
              <small>Share the meeting link to invite them</small>
            </div>
          )}
          <span className="video-label">Other Person</span>
        </div>

        {/* Local Video */}
        <div className="video-box local">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <span className="video-label">You</span>
        </div>
      </div>

      {/* Controls */}
      <div className="call-controls">
        <div className="ctrl-group">
          <button
            className={`ctrl-btn ${!micOn ? 'off' : ''}`}
            onClick={toggleMic}
            title={micOn ? 'Mute' : 'Unmute'}
          >
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <span className="ctrl-label">{micOn ? 'Mute' : 'Unmute'}</span>
        </div>

        <div className="ctrl-group">
          <button
            className="ctrl-btn end"
            onClick={endCall}
            title="End Call"
          >
            <PhoneOff size={22} />
          </button>
          <span className="ctrl-label">End Call</span>
        </div>

        <div className="ctrl-group">
          <button
            className={`ctrl-btn ${!camOn ? 'off' : ''}`}
            onClick={toggleCam}
            title={camOn ? 'Stop Video' : 'Start Video'}
          >
            {camOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
          <span className="ctrl-label">{camOn ? 'Stop Video' : 'Start Video'}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;