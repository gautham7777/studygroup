
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Profile } from '../types';
import { users as mockUsers, profiles as mockProfiles } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string) => Promise<void>;
  updateProfile: (updatedProfile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    try {
      const storedUser = localStorage.getItem('studySyncUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        const userProfile = mockProfiles.find(p => p.userId === parsedUser.id) || null;
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          setUser(foundUser);
          const userProfile = mockProfiles.find(p => p.userId === foundUser.id) || null;
          setProfile(userProfile);
          localStorage.setItem('studySyncUser', JSON.stringify(foundUser));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('User not found'));
        }
      }, 500);
    });
  }, []);

  const register = useCallback(async (username: string, email: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          setLoading(false);
          reject(new Error('Email already in use'));
          return;
        }

        const newUser: User = { id: Date.now(), username, email };
        const newProfile: Profile = {
            id: Date.now(),
            userId: newUser.id,
            bio: '',
            learningStyle: 'Visual' as any,
            preferredMethods: [],
            availability: 'Weekends',
            subjectsNeedHelp: [],
            subjectsCanHelp: [],
        }
        
        mockUsers.push(newUser);
        mockProfiles.push(newProfile);

        setUser(newUser);
        setProfile(newProfile);
        localStorage.setItem('studySyncUser', JSON.stringify(newUser));
        setLoading(false);
        resolve();
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('studySyncUser');
  }, []);

  const updateProfile = useCallback((updatedProfile: Profile) => {
    setProfile(updatedProfile);
    const profileIndex = mockProfiles.findIndex(p => p.id === updatedProfile.id);
    if (profileIndex !== -1) {
      mockProfiles[profileIndex] = updatedProfile;
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
