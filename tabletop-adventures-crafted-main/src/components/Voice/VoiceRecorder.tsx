
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const VoiceRecorder: React.FC<{
  onSave: (audioBlob: Blob) => void;
  maxDuration?: number;
}> = ({ onSave, maxDuration = 60 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Create audio element for playback
        const audio = new Audio(url);
        audioRef.current = audio;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prevTime + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please enable microphone access to use voice recording.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setIsRecording(false);
    }
  };

  const handleSaveRecording = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      onSave(audioBlob);
      toast({
        title: "Voice Message Saved",
        description: "Your voice message has been saved successfully.",
      });
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying(false);
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioChunksRef.current = [];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isRecording ? `Recording: ${formatTime(recordingTime)}` : "Voice Message"}
        </span>
        <span className="text-xs text-muted-foreground">
          {recordingTime > 0 && `${formatTime(recordingTime)} / ${formatTime(maxDuration)}`}
        </span>
      </div>
      
      {isRecording && (
        <Progress value={(recordingTime / maxDuration) * 100} className="h-1" />
      )}
      
      <div className="flex gap-2">
        {!isRecording && !audioUrl ? (
          <Button 
            onClick={startRecording} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : isRecording ? (
          <Button 
            onClick={stopRecording} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          <>
            <Button 
              onClick={togglePlayback} 
              variant="outline" 
              size="sm"
            >
              {isPlaying ? 
                <Pause className="h-4 w-4" /> : 
                <Play className="h-4 w-4" />
              }
            </Button>
            <Button 
              onClick={deleteRecording} 
              variant="outline" 
              size="sm"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSaveRecording} 
              size="sm"
              className="flex-1"
            >
              Save Voice Message
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
