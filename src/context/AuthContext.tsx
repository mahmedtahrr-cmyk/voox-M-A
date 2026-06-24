import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, hasRealSupabase } from '../lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: any }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  simulateAdmin: () => void;
  simulateGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Read or seed mock session for resilience
  useEffect(() => {
    if (!hasRealSupabase) {
      const storedMockUser = localStorage.getItem('voox_mock_user');
      if (storedMockUser) {
        const mockProfile = JSON.parse(storedMockUser);
        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          email: mockProfile.email,
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { full_name: mockProfile.full_name },
          created_at: mockProfile.created_at
        } as User);
      } else {
        setProfile(null);
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // 1. Listen to real Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        // Fetch or create profile
        await syncUserProfile(currentSession.user);
      } else {
        // Check if there's a simulated active session
        const storedMockUser = localStorage.getItem('voox_mock_user');
        if (storedMockUser) {
          const mockProfile = JSON.parse(storedMockUser);
          setProfile(mockProfile);
          // Mock minimal supabase user structure
          setUser({
            id: mockProfile.id,
            email: mockProfile.email,
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: {},
            user_metadata: { full_name: mockProfile.full_name },
            created_at: mockProfile.created_at
          } as User);
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    // 2. Initial check on mount
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user || null);
      if (initialSession?.user) {
        await syncUserProfile(initialSession.user);
      } else {
        const storedMockUser = localStorage.getItem('voox_mock_user');
        if (storedMockUser) {
          const mockProfile = JSON.parse(storedMockUser);
          setProfile(mockProfile);
          setUser({
            id: mockProfile.id,
            email: mockProfile.email,
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: {},
            user_metadata: { full_name: mockProfile.full_name },
            created_at: mockProfile.created_at
          } as User);
        }
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserProfile = async (supabaseUser: User) => {
    try {
      // Find matching profile from table (bypass throwing PGRST116 single entry exception)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id);

      if (error) {
        console.warn('Profile sync select failed:', error.message);
        throw error;
      }

      if (data && data.length > 0) {
        let currentProfile = data[0] as Profile;
        const isDefaultAdmin = supabaseUser.email === 'mahmedtahrr@gmail.com';
        if (isDefaultAdmin && currentProfile.role !== 'admin') {
          console.log('Upgrading profile role to admin in Supabase...');
          currentProfile.role = 'admin';
          const { error: updateErr } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', supabaseUser.id);
          if (updateErr) {
            console.warn('Failed to upgrade profile to admin:', updateErr.message);
          }
        }

        setProfile(currentProfile);
        
        // Track locally
        const stored = localStorage.getItem('voox_profiles');
        const profilesList = stored ? JSON.parse(stored) : [];
        const index = profilesList.findIndex((p: any) => p.id === currentProfile.id);
        if (index > -1) {
          profilesList[index] = currentProfile;
        } else {
          profilesList.push(currentProfile);
        }
        localStorage.setItem('voox_profiles', JSON.stringify(profilesList));
      } else {
        // Create matching profile in Supabase & local
        const isDefaultAdmin = supabaseUser.email === 'mahmedtahrr@gmail.com';
        const newProfile: Profile = {
          id: supabaseUser.id,
          full_name: supabaseUser.user_metadata?.full_name || 'VOOX OPERATIVE',
          
          phone: supabaseUser.user_metadata?.phone || null,
          role: isDefaultAdmin ? 'admin' : 'customer',
          created_at: new Date().toISOString()
        };
        
        const { error: insertErr } = await supabase.from('profiles').insert(newProfile);
        if (insertErr) {
          console.warn('Real time remote insert profile failed:', insertErr.message);
        }
        
        // Also track locally
        const stored = localStorage.getItem('voox_profiles');
        const profilesList = stored ? JSON.parse(stored) : [];
        if (!profilesList.some((p: any) => p.id === newProfile.id)) {
          profilesList.push(newProfile);
          localStorage.setItem('voox_profiles', JSON.stringify(profilesList));
        }

        setProfile(newProfile);
      }
    } catch (err: any) {
      console.warn('Falling back to local simulation for profile sync:', err?.message || err);
      // If profiles table unavailable, simulate base profile
      const isDefaultAdmin = supabaseUser.email === 'mahmedtahrr@gmail.com';
      const newProfile: Profile = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || 'VOOX OPERATIVE',
        
        phone: null,
        role: isDefaultAdmin ? 'admin' : 'customer',
        created_at: new Date().toISOString()
      };

      const stored = localStorage.getItem('voox_profiles');
      const profilesList = stored ? JSON.parse(stored) : [];
      if (!profilesList.some((p: any) => p.id === newProfile.id)) {
        profilesList.push(newProfile);
        localStorage.setItem('voox_profiles', JSON.stringify(profilesList));
      }

      setProfile(newProfile);
    }
  };

  const signIn = async (email: string, password = 'password123') => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Explicit Admin override for 'mahmedtahrr@gmail.com' and password 'mahmedtahrr'
    if (trimmedEmail === 'mahmedtahrr@gmail.com') {
      if (password === 'mahmedtahrr') {
        if (hasRealSupabase) {
          try {
            // Try signing in to real Supabase first
            const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
            if (!error && data.user) {
              await syncUserProfile(data.user);
              return { error: null };
            }
            
            // If sign in fails because user doesn't exist, try to sign up!
            if (error && (error.message.includes('Invalid login credentials') || error.status === 400)) {
              console.log('Admin user not found on Supabase. Attempting auto-registration...');
              const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
                email: trimmedEmail,
                password,
                options: { data: { full_name: 'ENG. Mohamed Taher' } }
              });

              if (signUpErr) {
                console.warn('Admin auto-signup failed:', signUpErr.message);
              } else if (signUpData.user) {
                console.log('Admin auto-registered successfully. Syncing admin profile...');
                const newProfile: Profile = {
                  id: signUpData.user.id,
                  full_name: 'ENG. Mohamed Taher',
                  phone: '01276812022',
                  role: 'admin',
                  created_at: new Date().toISOString()
                };
                
                await supabase.from('profiles').insert(newProfile);
                
                const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
                if (!signInErr && signInData.user) {
                  await syncUserProfile(signInData.user);
                  return { error: null };
                } else {
                  return { error: { message: 'تم إنشاء حساب المدير بنجاح في Supabase. يرجى تأكيد بريدك الإلكتروني إذا كانت خاصية التأكيد مفعلة، ثم حاول تسجيل الدخول مجدداً.' } };
                }
              }
            } else if (error) {
              return { error: { message: error.message } };
            }
          } catch (err: any) {
            console.warn('Real Supabase admin auth error:', err);
          }
        }

        // Local mock fallback (used if hasRealSupabase is false, or if we offline/error out)
        console.log('Falling back to local simulated admin session.');
        const mockProfile: Profile & { email: string } = {
          id: 'admin-mahmed',
          full_name: 'ENG. Mohamed Taher',
          
          phone: '01276812022',
          role: 'admin',
          created_at: new Date().toISOString(),
          email: 'mahmedtahrr@gmail.com'
        };
        localStorage.setItem('voox_mock_user', JSON.stringify(mockProfile));
        
        const stored = localStorage.getItem('voox_profiles');
        const profilesList = stored ? JSON.parse(stored) : [];
        if (!profilesList.some((p: any) => p.id === mockProfile.id)) {
          profilesList.push(mockProfile);
          localStorage.setItem('voox_profiles', JSON.stringify(profilesList));
        }

        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          email: mockProfile.email,
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { full_name: mockProfile.full_name },
          created_at: mockProfile.created_at
        } as User);
        return { error: null };
      } else {
        return { error: { message: 'كلمة المرور غير صحيحة لحساب المسؤول الشامل.' } };
      }
    }

    // If real Supabase is connected, we MUST verify with it instead of purely trusting local simulated accounts
    if (hasRealSupabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (error) {
          if (error.message.includes('Invalid login credentials') || error.status === 400) {
            return { error: { message: 'الحساب غير موجود أو كلمة المرور غير صحيحة. يرجى إنشاء حساب أولاً أو التأكد من البيانات.' } };
          }
          if (error.message.includes('Email not confirmed')) {
            return { error: { message: 'يرجى تأكيد البريد الإلكتروني الخاص بك من بريدك الوارد لإتمام عملية الدخول.' } };
          }
          return { error: { message: error.message } };
        }
        
        // Load profile
        if (data.user) {
          await syncUserProfile(data.user);
        }
        return { error: null };
      } catch (err: any) {
        console.warn('Supabase Auth failed:', err.message);
        return { 
          error: { 
            message: 'تعذر الاتصال بقاعدة البيانات للتحقق من الحساب، أو أن الحساب غير موجود.' 
          } 
        };
      }
    } else {
      // Checking if account exists in simulated local store
      const storedAccounts = localStorage.getItem('voox_simulated_accounts');
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      const matchedAccount = accounts.find((acc: any) => acc.email === trimmedEmail);

      if (matchedAccount) {
        if (matchedAccount.password !== password) {
          return { error: { message: 'كلمة المرور غير صحيحة بالمرة. يرجى التأكد من البيانات والمحاولة مجدداً.' } };
        }
        const mockProfile: Profile & { email: string } = {
          id: matchedAccount.id,
          full_name: matchedAccount.full_name,
          phone: matchedAccount.phone || '+20 100 234 5678',
          role: matchedAccount.role as 'customer' | 'admin',
          created_at: matchedAccount.created_at,
          email: trimmedEmail
        };
        
        localStorage.setItem('voox_mock_user', JSON.stringify(mockProfile));
        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          email: mockProfile.email,
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { full_name: mockProfile.full_name },
          created_at: mockProfile.created_at
        } as User);
        return { error: null };
      }
      
      return { 
        error: { 
          message: 'البريد الإلكتروني هذا غير مسجل لدينا بالنظام. يرجى الضغط على "إنشاء حساب جديد" بالأسفل أولاً.' 
        } 
      };
    }
  };

  const signUp = async (email: string, password = 'password123', fullName = 'VOOX AGENT') => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Always check if email already registered in our simulated accounts list to avoid duplicates
    const storedAccounts = localStorage.getItem('voox_simulated_accounts');
    const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    if (accounts.some((acc: any) => acc.email === trimmedEmail)) {
      return { error: { message: 'هذا البريد الإلكتروني مسجل للحساب بالفعل بالبوابة. يمكنك تسجيل الدخول.' } };
    }

    const isDefaultAdmin = trimmedEmail === 'mahmedtahrr@gmail.com';
    const mockProfile: Profile & { email: string } = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      full_name: fullName,
      phone: isDefaultAdmin ? '01276812022' : null,
      role: isDefaultAdmin ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
      email: trimmedEmail
    };
    
    // OPTIMISTIC LOCAL REGISTRATION FIRST (INSTANT)
    const newSimAcc = {
      id: mockProfile.id,
      email: trimmedEmail,
      password,
      full_name: fullName,
      role: mockProfile.role,
      phone: mockProfile.phone,
      created_at: mockProfile.created_at
    };
    accounts.push(newSimAcc);
    localStorage.setItem('voox_simulated_accounts', JSON.stringify(accounts));
    localStorage.setItem('voox_mock_user', JSON.stringify(mockProfile));
    
    const stored = localStorage.getItem('voox_profiles');
    const profilesList = stored ? JSON.parse(stored) : [];
    if (!profilesList.some((p: any) => p.email === trimmedEmail)) {
      profilesList.push(mockProfile);
      localStorage.setItem('voox_profiles', JSON.stringify(profilesList));
    }

    // Instantly reflect auth state
    setProfile(mockProfile);
    setUser({
      id: mockProfile.id,
      email: mockProfile.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { full_name: mockProfile.full_name },
      created_at: mockProfile.created_at
    } as User);

    // DUAL-WRITE: Background sync if supabase is active
    if (hasRealSupabase) {
      setTimeout(async () => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: { data: { full_name: fullName } }
          });
          
          if (!error && data.user) {
            const newProfile: Profile = {
              id: data.user.id,
              full_name: fullName,
              phone: null,
              role: isDefaultAdmin ? 'admin' : 'customer',
              created_at: new Date().toISOString()
            };
            try {
              await supabase.from('profiles').insert(newProfile);
            } catch (pErr) {
              console.warn('Background dynamic profile trigger error:', pErr);
            }
          }
        } catch (err) {
          console.warn('Background Supabase signUp sync failed.', err);
        }
      }, 0);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout failed, clearing local mock accounts.');
    }
    localStorage.removeItem('voox_mock_user');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Helper shortcuts to test Admin features
  const simulateAdmin = () => {
    const mockProfile: Profile & { email: string } = {
      id: 'mock-admin-id',
      full_name: 'ENG. Mohamed Taher',
      
      phone: '01276812022',
      role: 'admin',
      created_at: new Date().toISOString(),
      email: 'mahmedtahrr@gmail.com'
    };
    localStorage.setItem('voox_mock_user', JSON.stringify(mockProfile));
    setProfile(mockProfile);
    setUser({
      id: mockProfile.id,
      email: mockProfile.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { full_name: mockProfile.full_name },
      created_at: mockProfile.created_at
    } as User);
  };

  const simulateGuest = () => {
    const mockProfile: Profile & { email: string } = {
      id: 'mock-guest-id',
      full_name: 'NO BOUNDARIES USER',
      
      phone: null,
      role: 'customer',
      created_at: new Date().toISOString(),
      email: 'guest@voox.luxury'
    };
    localStorage.setItem('voox_mock_user', JSON.stringify(mockProfile));
    setProfile(mockProfile);
    setUser({
      id: mockProfile.id,
      email: mockProfile.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { full_name: mockProfile.full_name },
      created_at: mockProfile.created_at
    } as User);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      simulateAdmin,
      simulateGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
