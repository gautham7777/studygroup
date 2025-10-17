
import React, { useState, useMemo } from 'react';
import { profiles, users, subjects } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Profile, User, Subject } from '../types';

const UserProfileCard: React.FC<{ user: User, profile: Profile }> = ({ user, profile }) => {
    const getSubjectName = (id: number) => subjects.find(s => s.id === id)?.name || 'Unknown';
    
    return (
        <div className="bg-surface rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
                <div className="uppercase tracking-wide text-sm text-primary font-semibold">{user.username}</div>
                <p className="mt-2 text-slate-600 text-sm">{profile.bio}</p>
                <div className="mt-4">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase">Can Help With</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.subjectsCanHelp.map(id => (
                            <span key={`can-${id}`} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{getSubjectName(id)}</span>
                        ))}
                    </div>
                </div>
                 <div className="mt-4">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase">Needs Help With</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.subjectsNeedHelp.map(id => (
                            <span key={`need-${id}`} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{getSubjectName(id)}</span>
                        ))}
                    </div>
                </div>
                <button className="mt-6 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">Send Study Request</button>
            </div>
        </div>
    );
};


const MatchFinder: React.FC = () => {
    const { user } = useAuth();
    const [subjectFilter, setSubjectFilter] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<'offering' | 'seeking'>('offering');

    const filteredUsers = useMemo(() => {
        return profiles
            .filter(p => p.userId !== user?.id)
            .filter(p => {
                if (!subjectFilter) return true;
                const subjectId = parseInt(subjectFilter, 10);
                if (roleFilter === 'offering') {
                    return p.subjectsCanHelp.includes(subjectId);
                } else {
                    return p.subjectsNeedHelp.includes(subjectId);
                }
            });
    }, [user, subjectFilter, roleFilter]);

    return (
        <div>
            <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
                 <h1 className="text-3xl font-bold text-gray-800">Find Your Study Partner</h1>
                 <p className="text-gray-600 mt-2">Filter to find the perfect match for your study needs.</p>
                 <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                        <option value="">All Subjects</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                        <option value="offering">Offering Help</option>
                        <option value="seeking">Seeking Help</option>
                    </select>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(profile => {
                    const profileUser = users.find(u => u.id === profile.userId);
                    return profileUser ? <UserProfileCard key={profile.id} user={profileUser} profile={profile} /> : null;
                })}
            </div>
             {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>No matches found for your criteria.</p>
                    <p>Try broadening your search.</p>
                </div>
            )}
        </div>
    );
};

export default MatchFinder;
