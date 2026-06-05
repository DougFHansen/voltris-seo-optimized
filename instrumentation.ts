export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { register: registerInstrumentation } = await import('./utils/performance');
    registerInstrumentation();
  }
} 