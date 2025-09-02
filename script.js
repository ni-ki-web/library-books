const library = document.getElementById("library");
const newBookBtn = document.getElementById("newBookBtn");
const dialog = document.getElementById("bookDialog");
const form = document.getElementById("bookForm");
const cancelFormBtn = document.getElementById("cancelFormBtn");

const myLibrary = [];

// Book Constructor
function Book(title, author, pages, genre, read, imageUrl="", imageFile=null) {
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
    if (book.imageFile) {
        img.src = URL.createObjectURL(book.imageFile);
    } else if (book.imageUrl) {
        img.src = book.imageUrl;
    } else {
        img.src = "assets/placeholder-cover.png";
    }
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

    // Read status checkbox
    const readLabel = document.createElement("label");
    readLabel.className = "book-status";

    const readCheckbox = document.createElement("input");
    readCheckbox.type = "checkbox";
    readCheckbox.checked = book.read;
    readCheckbox.addEventListener("change", () => {
        book.toggleReadStatus();
    });

    const readText = document.createElement("span");
    readText.textContent = "Read";

    readLabel.appendChild(readCheckbox);
    readLabel.appendChild(readText);

    bookCard.appendChild(imgWrapper);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(genre);
    bookCard.appendChild(readLabel);

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

newBookBtn.addEventListener('click', () => { dialog.showModal(); });

cancelFormBtn.addEventListener('click', () => { dialog.close(); });

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const author = form.author.value.trim();
    const pages = parseInt(form.pages.value, 10);
    const genre = form.genre.value.trim();
    const read = form.read.checked;
    const imageUrl = form.imageUrl.value.trim();
    const imageFile = form.imageFile.files[0] || null;

    if (!title || !author || !Number.isFinite(pages) || pages < 1 || !genre) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    addBookToLibrary(title, author, pages, genre, read, imageUrl, imageFile);

    form.reset();
    dialog.close();
    displayBook();
});

// Test with data
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", true, "", "");
addBookToLibrary("1984", "George Orwell", 328, "Dystopian", false, "", "");
addBookToLibrary("Never Let Me Go", "Kazuo Ishiguro", 288, "Science-Fiction, Dystopian", true, "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353048590i/6334.jpg", "");
displayBook();