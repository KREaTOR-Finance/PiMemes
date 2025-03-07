// Mock Supabase client for testing
const mockSupabase = {
  from: (table) => {
    return {
      select: (fields) => {
        return {
          eq: (field, value) => {
            return {
              single: () => {
                // Mock data for testing
                if (table === 'users' && field === 'email' && value === 'test@example.com') {
                  return {
                    data: {
                      id: '123',
                      username: 'testuser',
                      email: 'test@example.com',
                      password_hash: '$2b$10$X7aHXCyVz5g5XJ5z5Z5z5O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5O',
                      pi_wallet_address: '0xtest',
                      pi_balance: 1000
                    },
                    error: null
                  };
                }
                return { data: null, error: { message: 'Not found' } };
              },
              limit: () => {
                return { data: [], error: null };
              },
              order: () => {
                return { data: [], error: null };
              }
            };
          },
          or: () => {
            return { data: [], error: null };
          },
          order: () => {
            return {
              limit: () => {
                return { data: [], error: null };
              }
            };
          },
          limit: () => {
            return { data: [], error: null };
          }
        };
      },
      insert: (data) => {
        return {
          select: () => {
            return { data: [{ id: '123', ...data[0] }], error: null };
          }
        };
      },
      update: (data) => {
        return {
          eq: () => {
            return { data: { ...data }, error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: () => {
            return { data: null, error: null };
          }
        };
      }
    };
  },
  channel: (name) => {
    return {
      on: () => {
        return {
          subscribe: () => {}
        };
      }
    };
  }
};

module.exports = mockSupabase; 