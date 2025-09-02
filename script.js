const library = document.getElementById("library");

const myLibrary = [];

// Book Constructor
function Book(title, author, pages, genre, read, imageUrl="", imageFile="") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.read = read;
    this.imageUrl = imageUrl;
    this.imageFile = imageFile;
}

//Toggle Method to switch read status
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
}

// Create book objects and add them to the library
function addBookToLibrary(title, author, pages, genre, read, imageUrl, imageFile) {
    const book = new Book(title, author, pages, genre, read, imageUrl, imageFile);
    myLibrary.push(book);
    return book;
}

// Create a book card that has all the book details
function buildBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.dataset.id = book.id;

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "book-cover";

    const img = document.createElement("img");
    img.src = book.imageUrl || "assets/placeholder-cover.png";
    img.alt = `${book.title}cover`;
    imgWrapper.appendChild(img);

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-meta";
    author.textContent = book.author;

    const pages = document.createElement("p");
    pages.className = "book-meta";
    pages.textContent = `${book.pages} pages`;

    const genre = document.createElement("p");
    genre.className = "book-meta";
    genre.textContent = book.genre;

    bookCard.appendChild(imgWrapper);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(genre);

    return bookCard;
}

// Display the book card in the library
function displayBook() {
    library.textContent = "";

    if(myLibrary.length === 0) {
        const emptyLibrary = document.createElement("p");
        emptyLibrary.textContent = "No book in the library. Add your first one!"
        library.appendChild(emptyLibrary);
        return;
    }

    const fragment = document.createDocumentFragment();
    myLibrary.forEach(book => {
        fragment.appendChild(buildBookCard(book));
    });
    library.appendChild(fragment);
}

// Test with data
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", true, "", "");
addBookToLibrary("1984", "George Orwell", 328, "Dystopian", false, "", "");
addBookToLibrary("Never Let Me Go", "Kazuo Ishiguro", 288, "Science-Fiction, Dystopian", true, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353048590i/6334.jpg", "");
displayBook();