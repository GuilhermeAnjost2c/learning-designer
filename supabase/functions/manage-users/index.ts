
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleOptions = () => {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
};

type WebhookPayload = {
  type: string;
  table: string;
  record: {
    [key: string]: any;
  };
  schema: string;
  old_record: {
    [key: string]: any;
  } | null;
};

export const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const body = await req.json();
    const { action } = body;

    // Create a new user
    if (action === 'createUser') {
      const { email, password, userData } = body;
      
      // Create the user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userData,
      });

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Create profile if needed
      if (authData.user) {
        // Return the created user data
        return new Response(
          JSON.stringify({ 
            user: authData.user,
            message: 'User created successfully' 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Update a user
    else if (action === 'updateUser') {
      const { userId, updates } = body;
      
      // Handle password update if provided
      if (updates.password) {
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: updates.password }
        );

        if (passwordError) {
          return new Response(
            JSON.stringify({ error: passwordError.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
      
      // Handle user metadata update if provided
      if (updates.userData) {
        const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { user_metadata: updates.userData }
        );

        if (metadataError) {
          return new Response(
            JSON.stringify({ error: metadataError.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ message: 'User updated successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user by ID
    else if (action === 'getUserById') {
      const { userId } = body;
      
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ user: data.user }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // List all users
    else if (action === 'listUsers') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ data }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Search users by name (fuzzy search in user_metadata.name)
    else if (action === 'searchUsers') {
      const { query } = body;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        return new Response(
          JSON.stringify({ 
            error: 'Query must be a string with at least 2 characters',
            data: []
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Get all users first (we need to filter client-side since metadata is not queryable)
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message, data: [] }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Filter users by name
      const queryLower = query.toLowerCase();
      const filteredUsers = data.users.filter(user => {
        const name = user.user_metadata?.name?.toLowerCase() || '';
        return name.includes(queryLower);
      });
      
      return new Response(
        JSON.stringify({ data: filteredUsers }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get managers or admin users
    else if (action === 'getManagersOrAdmin') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Filter to get only managers or admins
      const managers = data.users.filter(user => {
        const role = user.user_metadata?.role;
        return role === 'manager' || role === 'admin';
      });
      
      // Map to our expected format
      const formattedManagers = managers.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || 'Sem nome',
        email: user.email,
        role: user.user_metadata?.role || 'user',
      }));
      
      return new Response(
        JSON.stringify(formattedManagers),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Delete a user
    else if (action === 'deleteUser') {
      const { userId } = body;
      
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ message: 'User deleted successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
