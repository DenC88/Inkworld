
export interface Artist {
  id: string;
  name: string;
  avatar: string;
  style: string;
}

export interface Post {
  id: string;
  artist: Artist;
  imageUrl: string;
  caption: string;
  likes: number;
}

export interface Studio {
  title: string;
  uri: string;
}

export interface GroundingChunk {
  maps?: Studio;
  web?: {
    title: string;
    uri: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type AppView = 'feed' | 'explore' | 'ai_assistant' | 'profile';
