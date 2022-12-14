import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { MyERC20Token, MyERC721Token, TokenSale } from "../typechain-types";

const ERC20_TOKEN_RATIO = 5;
const NFT_TOKEN_PRICE = 5;



describe("NFT Shop", async () => {
    let tokenSaleContract: TokenSale;
    let erc20Token: MyERC20Token;
    let erc721Token: MyERC721Token;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;

    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token");
        const tokenSaleContractFactory = await ethers.getContractFactory(
            "TokenSale"
        );
        erc20Token = await erc20TokenFactory.deploy();
        await erc20Token.deployed();
        tokenSaleContract = await tokenSaleContractFactory.deploy(
            ERC20_TOKEN_RATIO,
            NFT_TOKEN_PRICE,
            erc20Token.address,
            erc721Token.address
        );
        await tokenSaleContract.deployed();

        const MINTER_ROLE = await erc20Token.MINTER_ROLE();
        const grantRoleTx = await erc20Token.grantRole(MINTER_ROLE, tokenSaleContract.address);

        await grantRoleTx.wait();

    });

    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const rate = await tokenSaleContract.ratio();
            expect(rate).to.eq(ERC20_TOKEN_RATIO);
        });

        it("uses a valid ERC20 as payment token", async () => {
            const paymentTokenAddress = await tokenSaleContract.paymentToken();
            expect(paymentTokenAddress).to.eq(erc20Token.address);
            const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token");
            const paymentTokenContract =
                erc20TokenFactory.attach(paymentTokenAddress);
            const myBalance = await paymentTokenContract.balanceOf(deployer.address);
            expect(myBalance).to.eq(0);
            const totalSupply = await paymentTokenContract.totalSupply();
            expect(totalSupply).to.eq(0);
        });
    });

    describe("When a user purchase an ERC20 from the Token contract", async () => {
        const amountToBeSentBn = ethers.utils.parseEther("1");
        const amountToBeReceived = amountToBeSentBn.div(ERC20_TOKEN_RATIO);
        let balanceBeforeBn: BigNumber;
        let purchaseGasCosts: BigNumber;
        //const balanceBeforeBn = acc1.getBalance("latest"); // to get the latest balance with keyword latest
        beforeEach(async () => {
            balanceBeforeBn = await acc1.getBalance();
            // console.log(balanceBeforeBn);
            const purchaseTokenTx = await tokenSaleContract.connect(acc1).purchaseTokens({ value: amountToBeSentBn });
            const purchaseTokenTxRecepit = await purchaseTokenTx.wait();
            const gasUnitsUsed = purchaseTokenTxRecepit.gasUsed;
            const gasPrice = purchaseTokenTxRecepit.effectiveGasPrice;
            purchaseGasCosts = gasUnitsUsed.mul(gasPrice);
        })
        it("charges the correct amount of ETH", async () => {
            const balanceAfterBn = await acc1.getBalance();
            const diff = balanceBeforeBn.sub(balanceAfterBn);
            const expectedDiff = amountToBeSentBn.add(purchaseGasCosts);
            const error = diff.sub(expectedDiff);
            expect(error).to.equal(0);

        });

        it("gives the correct amount of tokens", async () => {
            const acc1Balance = await erc20Token.balanceOf(acc1.address);
            expect(acc1Balance).to.equal(amountToBeReceived);
            console.log(acc1Balance);
        });

        it("increases the balance of Eth in the contract", async () => {
            const contractBalanceBn = await ethers.provider.getBalance(tokenSaleContract.address);
            expect(contractBalanceBn).to.equal(amountToBeSentBn);
            console.log("Contract Balance: ", contractBalanceBn);
        });


        describe("When a user burns an ERC20 at the Token contract", () => {
            let burnGasCosts: BigNumber;
            let approveGasCosts: BigNumber;

            beforeEach(async () => {

                const approveTx = await erc20Token.connect(acc1).approve(tokenSaleContract.address, amountToBeReceived);
                const approveTxReceipt = await approveTx.wait();
                const approveUnitsUsed = approveTxReceipt.gasUsed;
                const approveGasPrice = approveTxReceipt.effectiveGasPrice;
                approveGasCosts = approveUnitsUsed.mul(approveGasPrice);

                const burnTokenTx = await tokenSaleContract.connect(acc1).burnTokens(amountToBeReceived);
                const burnTokenTxRecepit = await burnTokenTx.wait();
                const burnGasUnitsUsed = burnTokenTxRecepit.gasUsed;
                const burnGasPrice = burnTokenTxRecepit.effectiveGasPrice;
                burnGasCosts = burnGasUnitsUsed.mul(burnGasPrice);
            })
            it("gives the correct amount of ETH", async () => {
                const balanceAfterBn = await acc1.getBalance();
                const diff = balanceBeforeBn.sub(balanceAfterBn);
                const expectedDiff = purchaseGasCosts.add(approveGasCosts).add(burnGasCosts);
                const error = expectedDiff.sub(diff);
                expect(error).to.equal(0);
            });

            it("burns the correct amount of tokens", async () => {
                const acc1balance = await erc20Token.balanceOf(acc1.address);
                expect(acc1balance).to.equal(0);
                const totalSupply = await erc20Token.totalSupply()
                expect(totalSupply).to.equal(0);

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
    });

    // describe("When a user burns their NFT at the Shop contract", () => {
    //     it("gives the correct amount of ERC20 tokens", () => {
    //         throw new Error("Not implemented");
    //     });
    //     it("updates the pool correctly", () => {
    //         throw new Error("Not implemented");
    //     });
    // });

    // describe("When the owner withdraw from the Shop contract", () => {
    //     it("recovers the right amount of ERC20 tokens", () => {
    //         throw new Error("Not implemented");
    //     });

    //     it("updates the owner account correctly", () => {
    //         throw new Error("Not implemented");
    //     });
    // });
});