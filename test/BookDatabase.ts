import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("BookDatabase", function () {

    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const BookDatabase = await hre.ethers.getContractFactory("BookDatabase");
        const bookDatabase = await BookDatabase.deploy();

        return { bookDatabase, owner, otherAccount };
    }

    it("Should totalBooks = 0", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        const totalBooks = await bookDatabase.totalBooks();
        expect(totalBooks).to.equal(0);
    });

    it("Should insert book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        await bookDatabase.insert({ title: "Novo livro", author: "Lucio" });
        const totalBooks = await bookDatabase.totalBooks();
        expect(totalBooks).to.equal(1); // esperado 1
    });


    it("Should edit book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        // preciso incluir o livro para depois poder editá-lo.
        // faço isso, pois os testes não podem depender de outro. Tem que ser isolado.
        await bookDatabase.insert({ title: "Novo livro", author: "Lucio" });
        await bookDatabase.edit(1, { title: "Novo livro atualizado", author: "Lucio Souza" });
        const editedBook = await bookDatabase.books(1);
        expect(editedBook.title).to.equal("Novo livro atualizado");
    });



    it("Should remove book by administrator", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        // preciso incluir o livro para depois poder removê-lo.
        // faço isso, pois os testes não podem depender de outro. Tem que ser isolado.
        await bookDatabase.insert({ title: "Novo livro", author: "Lucio" });
        await bookDatabase.destroy(1);
        const totalBooks = await bookDatabase.totalBooks();
        expect(totalBooks).to.equal(0);
    });



    // nesse caso o teste vai passar porque teve um erro.
    it("IS NOT administrator removing book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

        // Preciso me conectar ao contrato com outra conta diferente do 'administrator (owner)'
        // para tentar remover um livro, que no nosso contrato só pode ser removido pelo administrator
        const instanceOtherAccount = bookDatabase.connect(otherAccount);
        await expect(instanceOtherAccount.destroy(1))
            .to.be.revertedWith("Only administrator can delete a book"); // mesma mensagem que está no modifier
    });

});
