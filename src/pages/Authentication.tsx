import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }: any) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  if (mode !== 'login' && mode !== 'signup') {
    throw new Response(JSON.stringify({ message: 'Invalid mode.' }), {
      status: 422,
    });
  }

  // send to backend authentication server ...
  const response = await fetch('http://localhost:8080/auth/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Response(JSON.stringify(errorData), {
      status: response.status,
    });
  }

  const responseData = await response.json();
  return {
    message: responseData.message,
    token: responseData.token,
  };
}