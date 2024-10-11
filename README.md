### About

This project implements a simple **Book Database** smart contract using Solidity, deployed with Hardhat. The contract allows users to insert, edit, and remove books, where each book is stored with a title and an author. The contract utilizes a unique identifier for each book and tracks the total number of books in the system.

Key features include:
- **Controlled book editing**, where only the updated fields are changed.
- **Administrative controls** using a `modifier`, where only the contract owner (deployer) is allowed to delete books.
- Efficient book storage and retrieval using Solidity's `mapping` data structure.
- String comparison is handled via `keccak256` hashing for accurate checks.

This contract demonstrates essential Solidity features like storage management, modifiers for access control, and interaction with on-chain data, using Hardhat as the development and deployment framework.

