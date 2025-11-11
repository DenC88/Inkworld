
import React, { useState, useEffect } from 'react';
import { Post, Artist } from '../types';

// Mock Data
const mockArtists: Artist[] = [
    { id: '1', name: 'Inky', avatar: 'https://picsum.photos/seed/inky/100/100', style: 'Neo-Traditional' },
    { id: '2', name: 'Shade', avatar: 'https://picsum.photos/seed/shade/100/100', style: 'Blackwork' },
    { id: '3', name: 'Prism', avatar: 'https://picsum.photos/seed/prism/100/100', style: 'Watercolor' },
];

const mockPosts: Post[] = [
    { id: '1', artist: mockArtists[0], imageUrl: 'https://picsum.photos/seed/tattoo1/600/800', caption: 'Healed wolf piece from last month.', likes: 1204 },
    { id: '2', artist: mockArtists[1], imageUrl: 'https://picsum.photos/seed/tattoo2/600/800', caption: 'Geometric sleeve in progress.', likes: 2345 },
    { id: '3', artist: mockArtists[2], imageUrl: 'https://picsum.photos/seed/tattoo3/600/800', caption: 'A vibrant phoenix rising.', likes: 876 },
    { id: '4', artist: mockArtists[0], imageUrl: 'https://picsum.photos/seed/tattoo4/600/800', caption: 'Dagger and rose classic.', likes: 950 },
    { id: '5', artist: mockArtists[1], imageUrl: 'https://picsum.photos/seed/tattoo5/600/800', caption: 'Abstract dotwork.', likes: 1500 },
];

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8 animate-fade-in">
        <div className="p-4 flex items-center">
            <img src={post.artist.avatar} alt={post.artist.name} className="w-10 h-10 rounded-full mr-4 border-2 border-teal-500" />
            <div>
                <p className="font-bold text-white">{post.artist.name}</p>
                <p className="text-sm text-gray-400">{post.artist.style}</p>
            </div>
        </div>
        <img src={post.imageUrl} alt={post.caption} className="w-full h-auto" />
        <div className="p-4">
            <p className="text-gray-300 mb-2"><span className="font-bold text-white">{post.artist.name}</span> {post.caption}</p>
            <p className="text-sm text-gray-500 font-semibold">{post.likes.toLocaleString()} likes</p>
        </div>
    </div>
);


const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Simulate fetching posts
    setPosts(mockPosts);
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
