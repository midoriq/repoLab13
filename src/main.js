import supabase from './api-client'

main();

// przy usuwaniu artykułów pojawia się zapytanie czy na pewno chcesz usunąć ten artykuł

async function main() {

  console.log('main');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (session) {
    //test
  }

  if (error) {
    console.log(error)
    return;
  }
  const articleList = await fetchArticles();
}

async function fetchArticles() {
  const { data, error } = await supabase.from('article').select();
  if (error) {
    console.log(error);
    return;
  }
  // przy tagach kazdy kolor ma inny kolor jako background (tablica kolorow)
  const articleList = data.map(article => `
    ${article.title}

    ${new Date(article.created_at).toLocaleDateString()}

    `)

  return articleList;
}