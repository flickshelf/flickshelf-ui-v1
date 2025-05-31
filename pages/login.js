function login() {
    const loginEmail = document.querySelector('#login-email').value;
    const loginPassword = document.querySelector('#password-left').value;

    disableLoginButton({ button: 'login' })
    showLoginLoadingSpinner({ button: 'login' })

    axios.post('https://api.flickshelf.com/login', {
        loginEmail,
        loginPassword
    }).then((res) => {
        const userData = JSON.stringify(res.data)

        if (userData) {
            storeUserCredentialsOnBrowser(userData)

            window.location.pathname = '/index.html'
        } else {
            unableLoginButton({button: 'login'})
            alert('[ERROR]: Invalid email or password. Try again.')
        }
    })
    .catch((err) => {
        console.error(err)
    })
}

function storeUserCredentialsOnBrowser (userData) {
    localStorage.setItem('loggedUser', userData)
}

function showPasswordSignUp() {
    const btnSignin = document.getElementById('password-right')
    const showBtnPass = document.getElementById('show-password-right')

    if(btnSignin.type === 'password') {
        btnSignin.setAttribute('type', 'text')
        showBtnPass.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
        btnSignin.setAttribute('type', 'password')
        showBtnPass.classList.replace('fa-eye', 'fa-eye-slash')
    }
}

function showPasswordSignIn() {
    const btnSignup = document.getElementById('password-left')
    const showBtnPassLeft = document.getElementById('show-password-left')

    if (btnSignup.type === 'password') {
        btnSignup.setAttribute('type', 'text')
        showBtnPassLeft.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
        btnSignup.setAttribute('type', 'password')
        showBtnPassLeft.classList.replace('fa-eye','fa-eye-slash')
    }
}

function signUp() {
   const name = document.querySelector('#name').value;
   const signUpEmail = document.querySelector('#sign-up-email').value;
   const signUpPassword = document.querySelector('#password-right').value;

   const emailVerificationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === '' || signUpEmail  === '' || signUpPassword  === '' ) {
        return alert('All informations needs to be filled!')
    }

    if (signUpPassword.length < 8 || signUpPassword.length > 40) {
        return alert('[ERROR] Password must be between 8 and 40 caracters')
    }

    if (!emailVerificationRegex.test(signUpEmail)) {
        return alert('Please enter a valid email!');
    }

    disableLoginButton({ button: 'sign-up' })
    showLoginLoadingSpinner({ button: 'sign-up' })

   axios.post('https://api.flickshelf.com/signup', {
        name,
        signUpEmail,
        signUpPassword,
   }).then(() => {
        alert(`User ${name} created successfully!`)
        goToLoginSection();
   }).catch((err) => {
        if (err.status === 409) {
            alert(`Email ${signUpEmail} already exist!`)
        } else {
            alert('There was an error. Try again.')
        }
    }).finally(() => {
        unableLoginButton({ button: 'sign-up' })
    })
}

function goToLoginSection () {
    document.querySelector('#name').value = ''
    document.querySelector('#sign-up-email').value = '';
    document.querySelector('#password-right').value = '';

    const body = document.querySelector('body');
    body.className = 'sign-in-js';
}

function disableLoginButton (params) {
    const { button } = params

    buttonElement = button === 'sign-up' 
        ? document.querySelector('#sign-up-button') 
        : document.querySelector('#login-button')

    buttonElement.setAttribute('disabled', '')
    buttonElement.style.backgroundColor = 'grey'
    buttonElement.style.cursor = 'not-allowed'
    buttonElement.style.border = 'none'
    buttonElement.style.color = 'white'
}

function unableLoginButton (params) {
    const { button } = params

    buttonElement = button === 'sign-up' 
        ? document.querySelector('#sign-up-button') 
        : document.querySelector('#login-button')

    buttonElement.removeAttribute('disabled')
    buttonElement.style.backgroundColor = '#0866ff'
    buttonElement.style.cursor = 'pointer'
    buttonElement.style.border = '1px solid #0866ff'
    buttonElement.style.color = 'white'
    buttonElement.innerText = 'SIGN IN'
}

function showLoginLoadingSpinner(params) {
    const { button } = params
    let buttonElement = ''

    buttonElement = button === 'sign-up' 
        ? document.querySelector('#sign-up-button') 
        : document.querySelector('#login-button')
    
    buttonElement.innerHTML = '<img src="../png/white-button-spinner.gif" class="button-loader">'
}

const btnSignin = document.querySelector('#signin');
const btnSignup = document.querySelector('#signup');

const body = document.querySelector('body');

btnSignin.addEventListener('click', () => {
    body.className = "sign-in-js"
});

btnSignup.addEventListener('click', () => {
    body.className = "sign-up-js"
});
