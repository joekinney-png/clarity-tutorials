// template code
import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";
// template code
import { assert } from "chai";

describe("counter contract test suite", () => {
  // template code
  let counterClient: Client;
  // template code
  let provider: Provider;

  // largely template code
  before(async () => {
    // template code
    provider = await ProviderRegistry.createProvider();
    // template code + you have to include the contract address, contract name and folder name
    // does the contract address matter in the testing suite?
    counterClient = new Client(
      "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.counter",
      "counter",
      provider
    );
  });

  // template
  it("should have a valid syntax", async () => {
    await counterClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    // instantiate a variable that is an async function where:
    //   a. query object is instantiated to invoke the get-counter function, passing in no argument
    //   b. the query is sent to the chain by invoking method on Client and passing the query object
    //   c. the response is expected to be a number and processed using method on Result object
    //   d. processed result is returned
    const getCounter = async () => {
      const query = counterClient.createQuery({
        method: { name: "get-counter", args: [] },
      });
      const receipt = await counterClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    };
    // instantiate a variable that is an async function where:
    //   a. you create a transaction instead of a simple query (this modifies the state of the chain and costs STX on actual)
    //   b. sign transaction
    //   c. send the transaction to modify the state of the chain
    //   d. return
    const execMethod = async (method: string) => {
      const tx = counterClient.createTransaction({
        method: {
          // what are the options for name here? what does method mean?
          name: method,
          args: [],
        },
      });
      // sign the transaction with address using a method taken from Client
      // again, wondering if in the case of the testing library this actually matters here? Yes it does matter, hmm but why?
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      // invoke submitTrasanction, which believe is also a Client method
      const receipt = await counterClient.submitTransaction(tx);
      // return even though we would expect receipt to be nothing... is receipt a status code or something?
      // what does the real chain return? does the real chain return anything or does it just show up on the chain?
      return receipt;
    };

    // this is where the actual testing through invoking the two async functions above starts
    // template-ish code
    before(async () => {
      await counterClient.deployContract();
    });
    // invoke function to send query to chain and check initial counter variable
    it("should start at zero", async () => {
      const counter = await getCounter();
      assert.equal(counter, 0);
    });
    // invoke functions to send transactions to the chain (must wait for them since they are async)
    // what is the provider, what is the program actually running when it runs the provider?
    it("should increment", async () => {
      // send transaction
      await execMethod("increment");
      // send query
      assert.equal(await getCounter(), 17);
      // send transaction
      await execMethod("increment");
      // send query
      assert.equal(await getCounter(), 34);
    });
    it("should decrement", async () => {
      // send transaction
      await execMethod("decrement");
      // send query
      assert.equal(await getCounter(), 17);
      // send transaction
      await execMethod("decrement");
      // send query
      assert.equal(await getCounter(), 0);
    });
  });
  // close the instance of the chain
  after(async () => {
    await provider.close();
  });
});
