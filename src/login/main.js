import supabase from '../api-client'

document.querySelector('form').addEventListener("submit", async (e) => {

    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
}

)