const auth = firebase.auth();

function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
  .then(() => {

    window.location.href = "index.html";

  })
  .catch(err => alert(err.message));
}

function register() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
  .then(() => {

    window.location.href = "index.html";

  })
  .catch(err => alert(err.message));
}

function googleLogin() {

  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
  .then(() => {

    window.location.href = "index.html";

  });

}
