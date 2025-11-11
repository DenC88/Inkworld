
import React, { useState, useEffect, useCallback } from 'react';
import { Studio, GroundingChunk } from '../types';
import { findTattooStudios, getTattooTrends } from '../services/geminiService';
import { CompassIcon } from './icons';

const StudioCard: React.FC<{ studio: Studio }> = ({ studio }) => (
  <a 
    href={studio.uri} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200 block"
  >
    <h3 className="font-bold text-teal-400 truncate">{studio.title}</h3>
    <p className="text-sm text-gray-400 mt-1 truncate">View on Maps</p>
  </a>
);

const TrendCard: React.FC<{ trend: { text: string; chunks: GroundingChunk[] } }> = ({ trend }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
    <h3 className="font-bold text-teal-400 mb-2">Current Trends</h3>
    <p className="text-gray-300 whitespace-pre-wrap">{trend.text}</p>
    {trend.chunks.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h4>
        <ul className="list-disc list-inside text-sm">
          {trend.chunks.map((chunk, index) => (
            chunk.web && <li key={index}><a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">{chunk.web.title}</a></li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const Explore: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [studios, setStudios] = useState<GroundingChunk[]>([]);
  const [trends, setTrends] = useState<{ text: string; chunks: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number, longitude: number } | undefined>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Could not get user location:", error.message);
      }
    );
  }, []);

  const fetchTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trendData = await getTattooTrends();
      setTrends(trendData);
    } catch (err) {
      setError('Failed to fetch trends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setIsLoading(true);
    setError(null);
    setStudios([]);
    try {
      const results = await findTattooStudios(location, userCoords);
      setStudios(results);
    } catch (err) {
      setError('Failed to find studios. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Explore Artists & Studios</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a city or neighborhood..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 transition-colors duration-200 disabled:bg-gray-500 flex items-center"
        >
          <CompassIcon className="w-5 h-5 mr-2" />
          Search
        </button>
      </form>

      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {studios.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4">Studios Found:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studios.filter(s => s.maps).map((studioChunk, index) => (
              studioChunk.maps && <StudioCard key={index} studio={studioChunk.maps} />
            ))}
          </div>
        </>
      )}
      
      {trends && !isLoading && !studios.length && (
         <div className="mt-8">
            <TrendCard trend={trends} />
         </div>
      )}

    </div>
  );
};

export default Explore;
