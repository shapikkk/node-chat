const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("signin-form");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (username && password) {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('User registered successfully');
            container.classList.remove("right-panel-active");
        } else {
            alert('Failed to register user');
        }
    }
});

signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signin-username").value.trim();
    const password = document.getElementById("signin-password").value.trim();

    if (username && password) {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            localStorage.setItem('currentUser', username);
            window.location.href = '/';
        } else {
            alert('Failed to login');
        }
    }
});