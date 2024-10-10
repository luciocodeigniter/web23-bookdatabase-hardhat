// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract BookDatabase {
    struct Book {
        string title;
        string author;
        // string genre;
        // uint16 year;
        // uint16 pages;

        // ...
    }

    // identificador do livro
    uint32 private nextId = 0;

    // total de livros
    //! não posso usar o `nextId`, pois ele só incrementa
    uint256 public totalBooks;

    // lista de livros
    mapping(uint32 => Book) public books;

    // deployer do contrato é o administrador
    address private immutable administrator;

    constructor() {
        administrator = msg.sender;
    }

    // compara duas strings
    function compare(
        string memory str1,
        string memory str2
    ) private pure returns (bool) {
        bytes memory array1 = bytes(str1);
        bytes memory array2 = bytes(str2);

        return
            array1.length == array2.length && // comparamos os tamanhos
            keccak256(array1) == keccak256(array2); // e finalmente comparamos os conteúdos
    }

    // insere o livro
    function insert(Book memory newBook) public {
        nextId++;
        books[nextId] = newBook;
        totalBooks++;
    }

    // atualiza o livro
    function edit(uint32 id, Book memory newBook) public {
        // quero realizar atualizações de um livro de forma controlada,
        // sem substituir integralmente um pelo outro

        // recupero o livro a ser atualizado
        Book memory oldBook = books[id];

        // validamos se houve alteração na propriedade `title`
        // e se foi informado o novo valor da propriedade.
        // Ou seja, os titles precisam ser direrentes e não pode estar vazio
        if (
            !compare(oldBook.title, newBook.title) &&
            !compare(newBook.title, "")
        ) {
            books[id].title = newBook.title;
        }

        // validamos se houve alteração na propriedade `author`
        // e se foi informado o novo valor da propriedade.
        // Ou seja, os `authors` precisam ser direrentes e não pode estar vazio
        if (
            !compare(oldBook.author, newBook.author) &&
            !compare(newBook.author, "")
        ) {
            books[id].author = newBook.author;
        }
    }

    // remove o livro
    function destroy(uint32 id) public onlyAdmin {
        // antes de decrementar, preciso realmente verificar se existe o livro.
        //! Note que o delete books[i] não lança exception
        //! caso o `id` não exista.
        //! Portanto vamos avaliar se o `title` do book é diferente de vazio "",
        //! caso sim, então o livro foi encontrado e podemos remover e decrementar 
        //! o `totalBooks`
        if (!compare(books[id].title, "")) {
            delete books[id];
            totalBooks--;
        }
    }

    // trabalhando o conceito de `function modifiers`
    // posso dar qualquer nome para esse modifier.
    // Essa função modificadora é útil, pois concentramos em apenas
    // um lugar as regras que são pertinentes ao administrador
    modifier onlyAdmin() {
        require(
            administrator == msg.sender,
            "Only administrator can delete a book"
        );
        _; // obrigtório terminar com `_;`
    }
}
