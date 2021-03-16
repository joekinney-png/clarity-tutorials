// importing from the blockstack clarity package is what allows us to access methods simulating the blockchain
import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";
import { assert } from "chai";

describe("hello world contract test suite", () => {
  // initialize instance of the contract (contract deployed to chain)
  let helloWorldClient: Client;
  // initialize instance of the Stacks 2.0 blockchain simulator (stacks blockchain)
  // described as a "smart contract function"
  let provider: Provider;
  let echoNumArg = 123;

  before(async () => {
    // stacks chain initialization
    provider = await ProviderRegistry.createProvider();
    // client initialization (inputs are the contract address DOT contract name, location of file relative to contracts file,
    // and the chain)
    helloWorldClient = new Client(
      "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.hello-world",
      "hello-world",
      provider
    );
  });

  // "it" is the actual test (test 1)
  it("should have a valid syntax", async () => {
    // method on client object that checks to make sure the contract has correct syntax
    await helloWorldClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      // deploys the contract onto the chain
      // these methods return promises (makes sense in the context of communicating with the actual chain)
      // interacting with the chain seems somewhat similar to calling a web api
      await helloWorldClient.deployContract();
    });

    // test 2
    it("should return 'hello world'", async () => {
      // creates a query that can be sent to the chain
      const query = helloWorldClient.createQuery({
        method: { name: "say-hi", args: [] },
      });
      // sends the query to the chain and waits for the response back
      const receipt = await helloWorldClient.submitQuery(query);
      // bytecode back to unicode
      const result = Result.unwrapString(receipt, "utf8");
      // pulling from chai assertion library
      // how to check the return statements (not sure if even possible to use console.log in clarity program?)
      assert.equal(result, "hello world");
    });

    // test 3
    it("should echo number", async () => {
      // creating another query, this time passing an argument
      // pass as strings, wonder if you can declare it up top (yes and can be string or number)
      const query = helloWorldClient.createQuery({
        method: { name: "echo-number", args: [echoNumArg] },
      });
      // communication with the chain
      const receipt = await helloWorldClient.submitQuery(query);
      // why is it the case that we don't need utf-8 here?
      // because unwrapInt expects an integer and therefore only argument
      const result = Result.unwrapInt(receipt);
      // mocha assertion library
      assert.equal(result, 123);
    });
  });

  after(async () => {
    // what is the actual provider object
    // assuming that the provider is running on the local machine but why neccessary to close after completing the testing suite?
    await provider.close();
  });
});
