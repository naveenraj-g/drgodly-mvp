"use client";

import {
  ConnectionStateToast,
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

export function RoomControlUI() {
  // Get tracks for grid
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex-1 relative">
      <GridLayout tracks={tracks}>
        <ParticipantTile />
      </GridLayout>
      <RoomAudioRenderer />
      <ConnectionStateToast />

      {/* Controls at bottom center of video area */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <ControlBar
          variation="minimal"
          controls={{ screenShare: false, chat: false }}
        />
      </div>
    </div>
  );
}
