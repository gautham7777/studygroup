import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subjects as allSubjects } from '../data/mockData';
import { LearningStyle, StudyMethod, Profile as ProfileType } from '../types';
import { generateBio } from '../services/geminiService';

const Profile: React.FC = () => {
    const { profile, updateProfile } = useAuth();
    const [formData, setFormData] = useState<ProfileType | null>(profile ?? null);
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    if (!formData) return <div>Loading profile...</div>;

    const handleMultiSelectChange = (
        e: ChangeEvent<HTMLSelectElement>,
        field: 'subjectsCanHelp' | 'subjectsNeedHelp' | 'preferredMethods'
    ) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        const parsedValues = field.startsWith('subjects') ? values.map(Number) : values;
        setFormData({ ...formData, [field]: parsedValues });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setNotification('Profile saved successfully!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleGenerateBio = async () => {
        setIsGeneratingBio(true);
        try {
            const bio = await generateBio(formData, allSubjects);
            setFormData({ ...formData, bio });
        } catch (error) {
            console.error('Bio generation failed', error);
        } finally {
            setIsGeneratingBio(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-surface p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h1>
            {notification && (
                <div className="bg-secondary text-on-secondary p-3 rounded-md mb-4">{notification}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={handleGenerateBio}
                        disabled={isGeneratingBio}
                        className="mt-2 text-sm text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGeneratingBio ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700">Learning Style</label>
                        <select
                            id="learningStyle"
                            value={formData.learningStyle}
                            onChange={e => setFormData({ ...formData, learningStyle: e.target.value as LearningStyle })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        >
                            {Object.values(LearningStyle).map(style => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                        <input
                            type="text"
                            id="availability"
                            value={formData.availability}
                            onChange={e => setFormData({ ...formData, availability: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="preferredMethods" className="block text-sm font-medium text-gray-700">Preferred Study Methods</label>
                    <select
                        multiple
                        id="preferredMethods"
                        value={formData.preferredMethods}
                        onChange={e => handleMultiSelectChange(e, 'preferredMethods')}
                        className="mt-1 block w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                        {Object.values(StudyMethod).map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="subjectsCanHelp" className="block text-sm font-medium text-gray-700">Subjects I Can Help With</label>
                        <select
                            multiple
                            id="subjectsCanHelp"
                            value={formData.subjectsCanHelp.map(String)}
                            onChange={e => handleMultiSelectChange(e, 'subjectsCanHelp')}
                            className="mt-1 block w-full h-40 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        >
                            {allSubjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subjectsNeedHelp" className="block text-sm font-medium text-gray-700">Subjects I Need Help With</label>
                        <select
                            multiple
                            id="subjectsNeedHelp"
                            value={formData.subjectsNeedHelp.map(String)}
                            onChange={e => handleMultiSelectChange(e, 'subjectsNeedHelp')}
                            className="mt-1 block w-full h-40 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        >
                            {allSubjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
