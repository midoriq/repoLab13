import supabase from '../api-client'

document.querySelector('form').addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.pass.value;

    console.log(email, password);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        console.error("Login error", error);
        // tutaj zmienić to wyświetlanie
        alert("Nie można zalogować")
        return;
    }

    window.location.href = './';
})