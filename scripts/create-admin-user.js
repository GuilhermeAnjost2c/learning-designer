
// Cria o usuário admin para o primeiro login

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = "https://eeyjelnsgllzdtbnyrur.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Erro: SUPABASE_SERVICE_KEY não encontrada no ambiente.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('Criando usuário administrador...');

  // Dados do usuário admin
  const email = 'admin@learningdesigner.com';
  const password = 'admin12345';
  const name = 'Administrador';
  
  try {
    // Verificar se o usuário já existe
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);

    if (searchError) {
      throw searchError;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('O usuário administrador já existe.');
      return;
    }

    // Criar o usuário através do Auth API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        name,
        role: 'admin'
      }
    });

    if (error) {
      throw error;
    }

    console.log('Usuário administrador criado com sucesso!');
    console.log('Email:', email);
    console.log('Senha:', password);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error.message);
  }
}

createAdminUser();
