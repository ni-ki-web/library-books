const library = document.getElementById("library");
const newBookBtn = document.getElementById("newBookBtn");
const dialog = document.getElementById("bookDialog");
const form = document.getElementById("bookForm");
const cancelFormBtn = document.getElementById("cancelFormBtn");

const myLibrary = [];

// Book Constructor
function Book(title, author, pages, genre, status, imageUrl="", imageFile=null) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.status = status || "Not Read";
    this.imageUrl = imageUrl;
    this.imageFile = imageFile;
}

// Create book objects and add them to the library
function addBookToLibrary(title, author, pages, genre, status, imageUrl, imageFile) {
    const book = new Book(title, author, pages, genre, status, imageUrl, imageFile);
    myLibrary.push(book);
    return book;
}

// helper function to apply dynamic color classes
function applyStatusClass(selectOption, status) {
    selectOption.classList.remove("reading", "read", "not-read", "dropped");
    selectOption.classList.add(status.toLowerCase().replace(" ", "-"));
}

// Create a book card that has all the book details
/*
  div for the book card
  div to hold the book cover
  img for the book cover
  h3 for book title
  p for author, number of pages, genre
  dropdown selection for book read status -> option value
  delete button to remove the book card
*/
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
        img.src = "assets/defaultCover.png";
    }
    img.alt = `${book.title} cover`;
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

    // status dropdown
    const selectStatus = document.createElement("select");
    selectStatus.classList.add("book-status");
    ["Not Read", "Reading", "Read", "Dropped"].forEach(optionValue => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        if (book.status === optionValue) {
            option.selected = true;
        }
        selectStatus.appendChild(option);
    });
    
    applyStatusClass(selectStatus, book.status);

    selectStatus.addEventListener("change", () => {
        book.status = selectStatus.value;
        applyStatusClass(selectStatus, book.status);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-book");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        const index = myLibrary.findIndex(currentBook => currentBook.id === book.id);
        if (index > -1) {
            myLibrary.splice(index, 1);
        }
        bookCard.remove();

        if (myLibrary.length === 0) {
            displayBook();
        }
    });

    bookCard.appendChild(imgWrapper);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(genre);
    bookCard.appendChild(selectStatus);
    bookCard.appendChild(deleteBtn);

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

newBookBtn.addEventListener("click", () => { 
    dialog.showModal(); 
});

cancelFormBtn.addEventListener("click", () => { 
    dialog.close(); 
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const author = form.author.value.trim();
    const pages = parseInt(form.pages.value, 10);
    const genre = form.genre.value.trim();
    const status = form.status.value;
    const imageUrl = form.imageUrl.value.trim();
    const imageFile = form.imageFile.files[0] || null;

    if (!title || !author || !Number.isFinite(pages) || pages < 1 || !genre) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    addBookToLibrary(title, author, pages, genre, status, imageUrl, imageFile);

    form.reset();
    dialog.close();
    displayBook();
});

// Test with data
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", "Read", "", "");
addBookToLibrary("1984", "George Orwell", 328, "Dystopian", "Not Read", "", "");
addBookToLibrary("Never Let Me Go", "Kazuo Ishiguro", 288, "Science-Fiction, Dystopian", "Read", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353048590i/6334.jpg", "");
displayBook();