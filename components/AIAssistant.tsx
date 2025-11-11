
import React, { useState } from 'react';
import { generateTattooImage, editTattooImage, analyzeTattooImage, generateComplexConcept } from '../services/geminiService';
import { SparklesIcon } from './icons';

type AITab = 'generate' | 'edit' | 'analyze' | 'concept';

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${active ? 'bg-gray-700 text-teal-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
    >
        {children}
    </button>
);

const Loader: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
    </div>
);

const AIAssistant: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AITab>('generate');
    const [prompt, setPrompt] = useState<string>('');
    const [editPrompt, setEditPrompt] = useState<string>('');
    const [conceptPrompt, setConceptPrompt] = useState<string>('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            let res: string | null = null;
            if (activeTab === 'generate') {
                res = await generateTattooImage(prompt);
            } else if (activeTab === 'edit' && imageFile) {
                res = await editTattooImage(imageFile, editPrompt);
            } else if (activeTab === 'analyze' && imageFile) {
                res = await analyzeTattooImage(imageFile);
            } else if (activeTab === 'concept') {
                res = await generateComplexConcept(conceptPrompt);
            }
            setResult(res);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'generate':
                return (
                    <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., a geometric fox in space" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                );
            case 'edit':
                return (
                    <>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mx-auto mb-4" />}
                        <input type="text" value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder="e.g., add a watercolor background" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </>
                );
            case 'analyze':
                return (
                    <>
                        <p className="text-sm text-gray-400 mb-4 text-center">Upload a photo of a tattoo to get an AI analysis of its style and symbolism.</p>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mx-auto mb-4" />}
                    </>
                );
            case 'concept':
                return (
                    <>
                         <p className="text-sm text-gray-400 mb-4 text-center">Describe a complex idea and let AI flesh it out with symbolism and history.</p>
                         <textarea value={conceptPrompt} onChange={(e) => setConceptPrompt(e.target.value)} placeholder="e.g., a fusion of Norse mythology and Japanese Irezumi art" rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                    </>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">AI Tattoo Assistant</h2>
            <div className="flex border-b border-gray-700">
                <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>Generate</TabButton>
                <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>Edit</TabButton>
                <TabButton active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')}>Analyze</TabButton>
                <TabButton active={activeTab === 'concept'} onClick={() => setActiveTab('concept')}>Deep Dive</TabButton>
            </div>
            <div className="bg-gray-800 p-6 rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {renderTabContent()}
                    <button type="submit" disabled={isLoading} className="bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500 transition-colors duration-200 disabled:bg-gray-500 self-center flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Working...' : 'Go'}
                    </button>
                </form>

                {isLoading && <Loader />}
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
                
                {result && (
                    <div className="mt-6 border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">Result</h3>
                        {result.startsWith('data:image') ? (
                            <img src={result} alt="Generated tattoo" className="max-w-full mx-auto rounded-lg shadow-lg" />
                        ) : (
                            <div className="bg-gray-900 p-4 rounded-lg prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }}></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssistant;
