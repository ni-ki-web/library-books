class Book {
    constructor(title, author, pages, genre, status = "Not Read", imageUrl="", imageFile=null) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.genre = genre;
        this.status = status;
        this.imageUrl = imageUrl;
        this.imageFile = imageFile;
    }

    buildBookCard(onDelete, onStatusChange) {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.dataset.id = this.id;

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "book-cover";

        const img = document.createElement("img");
        if (this.imageFile) {
            img.src = URL.createObjectURL(this.imageFile);
        } else if (this.imageUrl) {
            img.src = this.imageUrl;
        } else {
            img.src = "assets/defaultCover.png";
        }
        img.alt = `${this.title} cover`;
        imgWrapper.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = this.title;

        const author = document.createElement("p");
        author.className = "book-meta";
        author.textContent = this.author;

        const pages = document.createElement("p");
        pages.className = "book-meta";
        pages.textContent = `${this.pages} pages`;

        const genre = document.createElement("p");
        genre.className = "book-meta";
        genre.textContent = this.genre;

        // status dropdown
        const selectStatus = document.createElement("select");
        selectStatus.classList.add("book-status");
        ["Not Read", "Reading", "Read", "Dropped"].forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;
            if (this.status === optionValue) {
                option.selected = true;
            }
            selectStatus.appendChild(option);
        });
        
        this.applyStatusClass(selectStatus);

        selectStatus.addEventListener("change", () => {
            this.status = selectStatus.value;
            this.applyStatusClass(selectStatus);
            if (onStatusChange) onStatusChange(this);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-book");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            if (onDelete) onDelete(this);
            bookCard.remove();
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

    applyStatusClass(selectOption) {
        selectOption.classList.remove("reading", "read", "not-read", "dropped");
        selectOption.classList.add(this.status.toLowerCase().replace(" ", "-"));
    }
}

class Library {
    constructor(libraryElement) {
        this.books = [];
        this.libraryElement = libraryElement;
    }

    addBook(book) {
        this.books.push(book);
        this.displayBook();
    }

    removeBook(book) {
        this.books = this.books.filter(b => b.id !== book.id);
        this.displayBook();
    }

    displayBook() {
        this.libraryElement.textContent = "";

        if (this.books.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No book in the library. Add your first one!";
            this.libraryElement.appendChild(emptyMsg);
            return;
        }

        const fragment = document.createDocumentFragment();
        this.books.forEach(book => {
            fragment.appendChild(
                book.buildBookCard(
                    (bookToDelete) => this.removeBook(bookToDelete), 
                    () => {} // status change handler if needed
                )
            );
        });
        this.libraryElement.appendChild(fragment);
    }
}

const myLibrary = new Library(document.getElementById("library"));
const newBookBtn = document.getElementById("newBookBtn");
const dialog = document.getElementById("bookDialog");
const form = document.getElementById("bookForm");
const cancelFormBtn = document.getElementById("cancelFormBtn");

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

    const book = new Book(title, author, pages, genre, status, imageUrl, imageFile);
    myLibrary.addBook(book);

    form.reset();
    dialog.close();
});

// Test with data
myLibrary.addBook(new Book("The Hobbit", "J.R.R. Tolkien", 310, "Fantasy", "Read", "", ""));
myLibrary.addBook(new Book("1984", "George Orwell", 328, "Dystopian", "Not Read", "", ""));
myLibrary.addBook(new Book("Never Let Me Go", "Kazuo Ishiguro", 288, "Science-Fiction, Dystopian", "Read", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353048590i/6334.jpg", ""));