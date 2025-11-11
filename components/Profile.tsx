
import React from 'react';

const Profile: React.FC = () => {
  const user = {
    name: 'Alex',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    bio: 'Lover of fine line and abstract blackwork tattoos. Always on the lookout for the next piece.',
    stylePreferences: ['Fine Line', 'Blackwork', 'Minimalist', 'Geometric'],
    wishlist: ['Shade', 'Inky'],
    tattoos: [
      { id: '1', imageUrl: 'https://picsum.photos/seed/mytattoo1/400/400', artist: 'Inky' },
      { id: '2', imageUrl: 'https://picsum.photos/seed/mytattoo2/400/400', artist: 'Local Artist' },
      { id: '3', imageUrl: 'https://picsum.photos/seed/mytattoo3/400/400', artist: 'Shade' },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-teal-500" />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400 mt-2">{user.bio}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Style Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {user.stylePreferences.map(style => (
            <span key={style} className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">{style}</span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">My Tattoos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {user.tattoos.map(tattoo => (
            <div key={tattoo.id} className="rounded-lg overflow-hidden">
              <img src={tattoo.imageUrl} alt="User tattoo" className="w-full h-full object-cover aspect-square" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
