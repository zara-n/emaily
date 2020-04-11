//writing a function to retrieve a blob of json
//making an ajax request - with the use of the "fetch" function
//http://rallycoding.herokuapp.com/api/music_albums

function fetchAlbums() {
     //fetch always returns a promise
    fetch("http://rallycoding.herokuapp.com/api/music_albums")
    .then(res => res.json()) //res.json() returns a promise of its own
    .then(json => console.log(json));
}

fetchAlbums();

//ES2017 syntax
//Refactor using Async / Await
//step 1: identify any function that uses some sort of async code or promises inside
//step 2: use the async key word in front of the function
//step 3: put await in front of any statement that induces a promise
//step 4: we create a variable to assign the resolve result of the promise to

async function fetchAlbumsNew() {
    //fetch always returns a promise
   const res = await fetch("http://rallycoding.herokuapp.com/api/music_albums")
   const json = await res.json() //res.json() returns a promise of its own
   
   console.log(json)
}

fetchAlbumsNew();

//Can be used in arrow function for as well
const fetchAlbumsArrow = async () => {
    const res = await fetch("http://rallycoding.herokuapp.com/api/music_albums")
    const json = await res.json() //res.json() returns a promise of its own
    
    console.log(json)
}