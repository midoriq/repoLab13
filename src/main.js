import supabase from './api-client'

main();

// przy usuwaniu artykułów pojawia się zapytanie czy na pewno chcesz usunąć ten artykuł

async function main() {

  console.log('main');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (session) {
    addLogOut();
    addArticle(session);
    deleteArticleButtons(session);
    editArticleButtons(session)
  } else {
    LogIn();
  }

  if (error) {
    console.log(error)
    return;
  }

  showArticles(session);
}

async function showArticles(session) {
  const articleList = await fetchArticles();
  document.getElementById("articles").innerHTML = articleList.join('');

  if (session) {
    deleteArticleButtons(session);
    editArticleButtons(session);
  }
}

async function fetchArticles() {
  const { data, error } = await supabase.from('article').select().order("id");
  if (error) {
    console.log(error);
    return;
  }

  const articleList = data.map((article, i) => {
    return `
      ${i > 0 ? '<hr class="my-4 border-gray-300"/>' : ''}
      <article data-article-id="${article.id}" class="bg-white rounded-lg shadow p-4 space-y-2">
        <h2 class="text-xl font-semibold text-blue-800">
           ${article.title}
        </h2>
        ${article.subtitle ? `<h3 class="text-md text-gray-600 italic">${article.subtitle}</h3>` : ''}
        <address rel = "author" class="text-sm text-gray-500">Autor: <span class="font-medium">${article.author}</span></address>
        <time datetime = "${article.created_at}" class="text-sm text-gray-400">${new Date(article.created_at).toLocaleDateString()}</time>
        <p class="text-gray-700">${article.content}</p>
      </article>
    `;
  });

  return articleList;
}

async function addArticle(session) {
  // Creating add new article button
  const addArticle = document.createElement('button');
  addArticle.textContent = 'Add article';
  addArticle.type = 'button';
  addArticle.id = "add-article"
  addArticle.className = "bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded";

  addArticle.addEventListener('click', async () => {
    const dialog = document.createElement("dialog");
    dialog.className = "bg-transparent p-6 rounded shadow-lg max-w-md mx-auto mt-20";
    dialog.innerHTML = `
    <section class="bg-white p-6 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20"> 
      <h2 class="text-2xl font-bold mb-4">Dodaj artykuł</h2> 
      <form id="add-article-form" class="flex flex-col gap-4"> 
        <label>
          Tytuł:
          <input type="text" name="title" required class="border p-2 rounded w-full"/>
        </label> 
        <label>
          Autor:
          <input type="text" name="author" required class="border p-2 rounded w-full" />
        </label> 
        <label>
          Treść:
          <textarea name="content" required class="border p-2 rounded w-full"></textarea> 
        </label> 
        <div class="flex justify-end gap-2">
          <button type="submit" class="bg-blue-500 text-white p-2 rounded">Dodaj artykuł</button> 
          <button type="button" id="cancel-add" class="bg-gray-400 text-white p-2 rounded">Anuluj</button>
        </div>
      </form> 
    </section>
  `;
    document.body.appendChild(dialog);
    dialog.showModal();

    dialog.querySelector("#cancel-add").addEventListener("click", () => {
      dialog.close();
      dialog.remove();
    });

    const form = dialog.querySelector("#add-article-form");
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      const content = e.target.content.value;

      const { error } = await supabase.from("article").insert({ title, author, content });

      if (error) {
        console.error(error);
        alert("Błąd podczas dodawania artykułu.");
        return;
      }

      dialog.close();
      dialog.remove();
      await showArticles(session);
    });
  });

  document.getElementById("nav").appendChild(addArticle);
}

function addLogOut() {
  const logout = document.createElement('button');
  logout.textContent = "Log out";
  logout.type = "button";
  logout.className = "bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded";

  logout.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    logout.remove();
    document.getElementById("add-article").remove();
    document.querySelectorAll(".deleteArticle").forEach(button => button.remove());

    LogIn();
    await showArticles(null);
  })

  document.getElementById("nav").appendChild(logout);
}

function LogIn() {
  const login = document.createElement('button')
  login.textContent = "Log in";
  login.type = "button";
  login.className = "bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded";

  login.addEventListener("click", async () => {
    window.location.href = "./login/index.html";
  })
  document.getElementById("nav").appendChild(login);
}

function deleteArticleButtons(session) {
  document.querySelectorAll("article").forEach(articleElement => {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete article";
    deleteButton.type = "button";
    deleteButton.className = "deleteArticle mt-4 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded";

    deleteButton.addEventListener("click", async () => {
      const articleID = articleElement.dataset.articleId;

      const confirmDelete = confirm('Na pewno chcesz usunąć ten artykuł?');
      if (!confirmDelete) return;

      const { error } = await supabase.from('article').delete().eq('id', articleID);

      if (error) {
        console.error(error);
        alert("Błąd przy usuwaniu artykułu.");
        return;
      }

      await showArticles(session);
    });

    articleElement.appendChild(deleteButton);
  });
}

function editArticleButtons(session) {
  document.querySelectorAll("article").forEach(articleElement => {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit article";
    editButton.type = "button";
    editButton.className = "editArticle mt-2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded";

    // ⬇️ Przeniesione do właściwego miejsca
    articleElement.appendChild(editButton);

    editButton.addEventListener("click", async () => {
      const articleId = articleElement.dataset.articleId;

      const { data: article, error: fetchError } = await supabase
        .from('article')
        .select()
        .eq('id', articleId)
        .single();

      if (fetchError) {
        console.error(fetchError);
        alert("Nie udało się pobrać artykułu.");
        return;
      }

      const dialog = document.createElement("dialog");
      dialog.className = "bg-transparent p-6 rounded shadow-lg max-w-md mx-auto mt-20";
      dialog.innerHTML = `
  <section class="bg-white p-6 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20"> 
    <h2 class="text-2xl font-bold mb-4">Edytuj artykuł</h2> 
    <form id="edit-article-form" class="flex flex-col gap-4"> 
      <label>
        Tytuł:
        <input type="text" name="title" required class="border p-2 rounded w-full" value="${article.title}" />
      </label> 
      <label>
        Autor:
        <input type="text" name="author" required class="border p-2 rounded w-full" value="${article.author}" />
      </label> 
      <label>
        Treść:
        <textarea name="content" required class="border p-2 rounded w-full">${article.content}</textarea> 
      </label> 
      <div class="flex justify-end gap-2">
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">Zapisz zmiany</button> 
        <button type="button" id="cancel-edit" class="bg-gray-400 text-white p-2 rounded">Anuluj</button>
      </div>
    </form> 
  </section>
`;

      document.body.appendChild(dialog);
      dialog.showModal();

      dialog.querySelector("#cancel-edit").addEventListener("click", () => {
        dialog.close();
        dialog.remove();
      });

      const form = dialog.querySelector("#edit-article-form");
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const author = e.target.author.value;
        const content = e.target.content.value;

        const { error } = await supabase
          .from('article')
          .update({
            title,
            author,
            content,
            created_at: new Date().toISOString()
          })
          .eq('id', articleId);

        if (error) {
          console.error(error);
          alert("Błąd podczas edytowania artykułu.");
          return;
        }

        dialog.close();
        dialog.remove();
        await showArticles(session);
      });
    });
  });
}
