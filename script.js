const myLibrary = [];

// Book Constructor
function Book(title, author, pages, genre, read, imageUrl="", imageFile) {
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
function addBookToLibrary(book) {
    const book = new Book(title, author, pages, genre, read, imageUrl, imageFile);
    myLibrary.push(book);
    return book;
}