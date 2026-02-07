async function debug() {
    try {
        console.log('Testing Login...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin' })
        });

        const loginData: any = await loginResponse.json();
        if (!loginResponse.ok) throw new Error(loginData.message || 'Login failed');

        const token = loginData.token;
        console.log('Login Success.');

        console.log('Fetching Characters...');
        const charsResponse = await fetch('http://localhost:3000/api/characters', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const charsData = await charsResponse.json();
        console.log('Status Code:', charsResponse.status);
        console.log('Characters Result:', JSON.stringify(charsData, null, 2));

    } catch (error: any) {
        console.error('Debug Error:', error.message);
    }
}

debug();
