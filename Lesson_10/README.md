Lesson 10 - TokenSale.sol


Challenge explanation

Application Features
    Buy a ERC20 with ETH for a fixed ratio
    Withdraw ETH by burning the ERC20 tokens
    Buy (Mint) a new ERC721 for a configured price
    Update owner account whenever a NFT is sold
    Allow owner to withdraw from account
        Only half of sales value is available for withdraw
    Allow users to burn their NFTs to recover half of the purchase price
Architecture overview
Contract external calls


Tests layout

(Review) TDD methodology
Best practices on external calls
Dealing with decimals and divisions
    Shifting decimal points
    Underflow
    Overflow
(Review) Test syntax
(Review) Positive and negative tests
Integration tests


References

https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/external-calls/

https://docs.soliditylang.org/en/latest/types.html#division

https://github.com/wissalHaji/solidity-coding-advices/blob/master/best-practices/rounding-errors-with-division.md



Test code reference

import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT Shop", () => {
  beforeEach(() => {});

  describe("When the Shop contract is deployed", () => {
    it("defines the ratio as provided in parameters", () => {
      throw new Error("Not implemented");
    });

    it("uses a valid ERC20 as payment token", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", () => {
    it("charges the correct amount of ETH", () => {
      throw new Error("Not implemented");
    });

    it("gives the correct amount of tokens", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns an ERC20 at the Token contract", () => {
    it("gives the correct amount of ETH", () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", () => {
    it("charges the correct amount of ETH", () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", () => {
      throw new Error("Not implemented");
    });

    it("update the pool account correctly", () => {
      throw new Error("Not implemented");
    });

    it("favors the pool with the rounding", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", () => {
    it("gives the correct amount of ERC20 tokens", () => {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", () => {
    it("recovers the right amount of ERC20 tokens", () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", () => {
      throw new Error("Not implemented");
    });
  });
});


References
https://fravoll.github.io/solidity-patterns/

https://dev.to/jamiescript/design-patterns-in-solidity-1i28

Homework
Create Github Issues with your questions about this lesson
Read the references