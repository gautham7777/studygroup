
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studyGroups, subjects, profiles, users } from '../data/mockData';
import { User, Profile, Subject } from '../types';

const UserCard: React.FC<{ user: User; profile: Profile }> = ({ user, profile }) => {
    const getSubjectName = (id: number) => subjects.find(s => s.id === id)?.name || 'Unknown';
    
    return (
        <div className="bg-surface p-4 rounded-lg shadow transition-transform hover:scale-105">
            <h3 className="font-bold text-lg text-primary">{user.username}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{profile.bio}</p>
            <div className="mt-3">
                <h4 className="font-semibold text-xs text-gray-500 uppercase">Can Help With</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {profile.subjectsCanHelp.map(id => (
                        <span key={id} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{getSubjectName(id)}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Dashboard: React.FC = () => {
    const { user, profile } = useAuth();

    const myGroups = studyGroups.filter(g => g.members.includes(user!.id));
    
    // Simple matching: suggest users who can help with subjects the current user needs help with
    const suggestedPartners = profiles.filter(p => {
        if (p.userId === user!.id) return false;
        return p.subjectsCanHelp.some(s => profile?.subjectsNeedHelp.includes(s));
    }).slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.username}!</h1>
                <p className="text-gray-600 mt-2">Here's your study dashboard. Let's make today productive!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700">My Study Groups</h2>
                    {myGroups.length > 0 ? (
                        <div className="space-y-4">
                            {myGroups.map(group => (
                                <Link key={group.id} to={`/group/${group.id}`} className="block bg-surface p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <h3 className="font-bold text-primary">{group.name}</h3>
                                    <p className="text-sm text-gray-500">Subject: {subjects.find(s => s.id === group.subjectId)?.name}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                           <p className="text-gray-500">You're not in any study groups yet.</p>
                           <Link to="/find" className="mt-2 inline-block text-primary font-semibold hover:underline">Find a group or partner</Link>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Suggested Partners</h2>
                    {suggestedPartners.length > 0 ? (
                         <div className="space-y-4">
                            {suggestedPartners.map(p => {
                                const partnerUser = users.find(u => u.id === p.userId);
                                return partnerUser ? <UserCard key={p.id} user={partnerUser} profile={p} /> : null;
                            })}
                         </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                           <p className="text-gray-500">No suggestions right now.</p>
                           <Link to="/profile" className="mt-2 inline-block text-primary font-semibold hover:underline">Complete your profile for better matches!</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
