import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./Podcast.css";
import NaviMain from "../NaviMain/NaviMain";

const Podcast = () => {
  const podcastList = [
    {
      id: 1,
      title: "Episode 1: Understand Your Anxiety - Mel Robbins",
      youtubeEmbed: "https://www.youtube.com/embed/G0P2L1BbkP0", // Embed URL format
    },
    {
      id: 2,
      title: "Episode 2: Be Happy - Mel Robbins",
      youtubeEmbed: "https://www.youtube.com/embed/Nqs6I2kMW8M", // Embed URL format
    },
    {
      id: 3,
      title: "Episode 3: Let Them Theory - Mel Robbins",
      youtubeEmbed: "https://www.youtube.com/embed/d4z5C8G32AY", // Embed URL format
    },
    {
      id: 4,
      title: "Episode 4: The ROOT of Trauma - Jay Shetty Podcast",
      youtubeEmbed: "https://www.youtube.com/embed/OTQJmkXC2EI", // Embed URL format
    },
    {
      id: 5,
      title: "Episode 5: How to Raise Mentally Resilient Children - Jay Shetty Podcast",
      youtubeEmbed: "https://www.youtube.com/embed/avx4Ww9h3Tc", // Embed URL format
    },
    {
      id: 6,
      title: "Episode 6: Signs You're Dealing With A Narcissist - Jay Shetty Podcast",
      youtubeEmbed: "https://www.youtube.com/embed/RAv8ysXZ0U4", // Embed URL format
    },
  ];

  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const openPodcast = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const closePodcast = () => {
    setSelectedPodcast(null);
  };

  // Close the podcast modal when clicking outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('podcast-overlay')) {
      closePodcast();
    }
  };

  return (
    <div className="podcast-container">
      <div className="nav-main">
        <NaviMain />
      </div>

      <div className="podcast-list">
        <h3>🎧 Choose a Podcast Episode</h3>
        <ul>
          {podcastList.map((podcast) => (
            <li
              key={podcast.id}
              className="episode-item"
              onClick={() => openPodcast(podcast)}
            >
              {podcast.title}
            </li>
          ))}
        </ul>
      </div>

      {selectedPodcast && (
        <div
          className="podcast-overlay"
          onClick={handleOverlayClick}  // Handle clicks outside the modal content
        >
          <div className="podcast-modal">
            <ReactPlayer
              url={selectedPodcast.youtubeEmbed}
              width="100%"
              height="315px"
              controls={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcast;
