import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if credentials are valid non-placeholder strings
export const isSupabaseConfigured = Boolean(
  envUrl &&
  typeof envUrl === 'string' &&
  (envUrl.startsWith('https://') || envUrl.startsWith('http://')) &&
  !envUrl.includes('your_supabase_project_url') &&
  envKey &&
  typeof envKey === 'string' &&
  envKey.length > 10 &&
  !envKey.includes('your_publishable_key')
);

// Fallback mock client so the app runs smoothly with offline local-first sync
const createFallbackClient = () => {
  const fallbackAuth = {
    getUser: async () => {
      const stored = localStorage.getItem('kinetix_auth_user');
      return { data: { user: stored ? JSON.parse(stored) : null }, error: null };
    },
    getSession: async () => {
      const stored = localStorage.getItem('kinetix_auth_user');
      return { data: { session: stored ? { user: JSON.parse(stored) } : null }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      if (email && password) {
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'member';
        const user = { 
          id: `usr-${Date.now()}`, 
          email, 
          role, 
          user_metadata: { role, name: email.split('@')[0] } 
        };
        localStorage.setItem('kinetix_auth_user', JSON.stringify(user));
        return { data: { user, session: { user } }, error: null };
      }
      return { data: null, error: { message: 'Invalid email or password' } };
    },
    signUp: async ({ email, password, options }) => {
      if (email && password) {
        const role = options?.data?.role || 'member';
        const user = { 
          id: `usr-${Date.now()}`, 
          email, 
          role, 
          user_metadata: { role, ...options?.data } 
        };
        localStorage.setItem('kinetix_auth_user', JSON.stringify(user));
        return { data: { user, session: { user } }, error: null };
      }
      return { data: null, error: { message: 'Signup failed. Please provide email and password.' } };
    },
    signOut: async () => {
      localStorage.removeItem('kinetix_auth_user');
      return { error: null };
    },
    onAuthStateChange: (callback) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };

  const createTableQueryBuilder = (tableName) => {
    return {
      select: async (columns = '*') => {
        try {
          const stored = localStorage.getItem(`kinetix_table_${tableName}`);
          if (stored) {
            return { data: JSON.parse(stored), error: null };
          }
        } catch (e) {
          console.warn(`LocalStorage read error for ${tableName}`, e);
        }
        return { data: null, error: null };
      },
      insert: async (rows) => {
        try {
          const rowList = Array.isArray(rows) ? rows : [rows];
          const stored = localStorage.getItem(`kinetix_table_${tableName}`);
          const existing = stored ? JSON.parse(stored) : [];
          const newRows = rowList.map((r, i) => ({ 
            id: r.id || `id-${Date.now()}-${i}`, 
            created_at: new Date().toISOString(), 
            ...r 
          }));
          localStorage.setItem(`kinetix_table_${tableName}`, JSON.stringify([...newRows, ...existing]));
          return { data: newRows, error: null };
        } catch (e) {
          return { data: null, error: { message: e.message } };
        }
      },
      update: async (updates) => {
        return {
          eq: async (col, val) => {
            try {
              const stored = localStorage.getItem(`kinetix_table_${tableName}`);
              if (stored) {
                const list = JSON.parse(stored);
                const updated = list.map(item => item[col] === val ? { ...item, ...updates } : item);
                localStorage.setItem(`kinetix_table_${tableName}`, JSON.stringify(updated));
              }
              return { error: null };
            } catch (e) {
              return { error: { message: e.message } };
            }
          }
        };
      },
      delete: () => {
        return {
          eq: async (col, val) => {
            try {
              const stored = localStorage.getItem(`kinetix_table_${tableName}`);
              if (stored) {
                const list = JSON.parse(stored);
                const updated = list.filter(item => item[col] !== val);
                localStorage.setItem(`kinetix_table_${tableName}`, JSON.stringify(updated));
              }
              return { error: null };
            } catch (e) {
              return { error: { message: e.message } };
            }
          }
        };
      }
    };
  };

  const fallbackStorage = {
    from: (bucket) => ({
      upload: async (filePath, file) => {
        try {
          // If in browser, create a local preview URL
          const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
          return { data: { path: filePath, publicUrl: previewUrl }, error: null };
        } catch (e) {
          return { data: null, error: { message: e.message } };
        }
      },
      getPublicUrl: (filePath) => {
        return { data: { publicUrl: `https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop` } };
      }
    })
  };

  return {
    from: (table) => createTableQueryBuilder(table),
    auth: fallbackAuth,
    storage: fallbackStorage
  };
};

export const supabase = isSupabaseConfigured
  ? createClient(envUrl, envKey)
  : createFallbackClient();

export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured,
    url: isSupabaseConfigured ? envUrl : 'Offline / Demo Mode',
    mode: isSupabaseConfigured ? 'Live PostgreSQL via Supabase' : 'Offline / LocalStorage Sync'
  };
};

// Storage Upload Helper with Public URL generation
export const uploadFileToStorage = async (bucketName, file, customName) => {
  if (!file) return null;
  
  const ext = file.name ? file.name.split('.').pop() : 'jpg';
  const fileName = `${customName || 'asset'}-${Date.now()}.${ext}`;

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error(`Storage upload error to ${bucketName}:`, error);
        // Fallback to object URL if permission/bucket fails
        return URL.createObjectURL(file);
      }

      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return publicData?.publicUrl || URL.createObjectURL(file);
    } else {
      // Demo / Offline Mode: Create local Object URL
      return URL.createObjectURL(file);
    }
  } catch (err) {
    console.warn(`Storage upload handled with fallback:`, err);
    return typeof file === 'string' ? file : URL.createObjectURL(file);
  }
};