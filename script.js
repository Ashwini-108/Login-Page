const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('message').textContent = data.message;
            window.location.href = 'user.html'; // Redirect to user.html on successful login
        } else {
            document.getElementById('message').textContent = data.message;
        }
    } catch (err) {
        console.error('Error logging in:', err);
        document.getElementById('message').textContent = 'Failed to log in';
    }
});
