// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

/**
 * Esse é o script de deploy do contrato
 */

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const BookDatabaseModule = buildModule("BookDatabaseModule", (m) => {

  //! essa linha que faz o deploy do contrato
  const bookDatabase = m.contract("BookDatabase");
  return { bookDatabase };
});

export default BookDatabaseModule;
