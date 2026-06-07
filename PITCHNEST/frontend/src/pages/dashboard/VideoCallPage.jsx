import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useAuth } from '../../store/auth';
import './VideoCallPage.css';

const socket = io('http://localhost:1000');

const VideoCallPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connected, setConnected] = useState(false);

  const iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    let localStream;

    const startCall = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        peerConnectionRef.current = new RTCPeerConnection(iceServers);

        // ✅ Local tracks add karo
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStream);
        });

        // ✅ Remote stream
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setConnected(true);
          }
        };

        // ✅ ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomId);
          }
        };

        // ✅ Room join karo
        socket.emit('join-room', roomId, user?._id);

        // ✅ Dusra user aaye toh offer bhejo
        socket.on('user-connected', async () => {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('offer', offer, roomId);
        });

        // ✅ Offer receive karo
        socket.on('offer', async (offer) => {
          await peerConnectionRef.current.setRemoteDescription(offer);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', answer, roomId);
        });

        // ✅ Answer receive karo
        socket.on('answer', async (answer) => {
          await peerConnectionRef.current.setRemoteDescription(answer);
        });

        // ✅ ICE candidate receive karo
        socket.on('ice-candidate', async (candidate) => {
          await peerConnectionRef.current.addIceCandidate(candidate);
        });

        // ✅ Dusra user disconnect ho
        socket.on('user-disconnected', () => {
          setConnected(false);
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

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socket.disconnect();
    };
  }, [roomId]);

  // ✅ Mic toggle
  const toggleMic = () => {
    const audioTrack = localVideoRef.current?.srcObject?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  // ✅ Camera toggle
  const toggleCam = () => {
    const videoTrack = localVideoRef.current?.srcObject?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  };

  // ✅ Call end
  const endCall = () => {
    localVideoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    peerConnectionRef.current?.close();
    socket.disconnect();
    navigate(-1);
  };

  return (
    <div className="video-call-page">
      <div className="video-grid">
        {/* Remote Video */}
        <div className="video-box remote">
          <video ref={remoteVideoRef} autoPlay playsInline />
          {!connected && (
            <div className="waiting-text">
              <p>Waiting for other person to join...</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="video-box local">
          <video ref={localVideoRef} autoPlay playsInline muted />
        </div>
      </div>

      {/* Controls */}
      <div className="call-controls">
        <button className={`ctrl-btn ${!micOn ? 'off' : ''}`} onClick={toggleMic}>
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        <button className="ctrl-btn end" onClick={endCall}>
          <PhoneOff size={22} />
        </button>
        <button className={`ctrl-btn ${!camOn ? 'off' : ''}`} onClick={toggleCam}>
          {camOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;