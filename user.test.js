import { test } from "node:test";
import assert from "node:assert";
import { insertUser, getUsers } from "./user.js";

test("getUsers", async t => {
  const db = {
    collection: () => {
      return {
        find: () => {
          return {
            toArray: async () => {
              return [
                { name: "Epsilon" },
                { name: "Zeta" }
              ];
            }
          };
        }
      };
    }
  };

  const names = await getUsers(db);
  assert.deepStrictEqual(names, ["Epsilon", "Zeta"], "");
});

test("getUsers（DBエラー）", async t => {
  const db = {
    collection: () => {
      return {
        find: () => {
          return {
            toArray: async () => {
              return [];
            }
          };
        }
      };
    }
  };

  let count = 0;
  try {
    await getUsers(db);
  } catch (error) {
    count++;
    assert.strictEqual(error.message, "DB Error", "エラーメッセージは DB Error");
  }
  assert.strictEqual(count, 1, "エラーが 1 度発生する");
});

test("insertUser（成功）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, "test");
  assert.strictEqual(insertOne.mock.callCount(), 1, "insertOne は 1 度だけ呼び出される");
  assert.strictEqual(status, 200, "ステータスコードは 200");
  assert.strictEqual(message, "OK", "レスポンスメッセージは OK");
});

test("insertUser（不正：数値）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, 123);
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser（不正：空文字）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, "");
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser（不正：100文字以上）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const longName = "a".repeat(100);
  const { status, message } = await insertUser(db, longName);
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser（不正：null）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, null);
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser（不正：配列）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, ["test"]);
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser（不正：オブジェクト）", async t => {
  const insertOne = t.mock.fn();
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, { name: "test" });
  assert.strictEqual(insertOne.mock.callCount(), 0, "insertOne は呼び出されない");
  assert.strictEqual(status, 400, "ステータスコードは 400");
  assert.strictEqual(message, "Bad Request", "レスポンスメッセージは Bad Request");
});

test("insertUser （不正：DBエラー）", async t => {
  const insertOne = t.mock.fn(() => {
    throw new Error("DB Error");
  });
  const db = {
    collection: () => {
      return { insertOne };
    }
  };

  const { status, message } = await insertUser(db, "test");
  assert.strictEqual(insertOne.mock.callCount(), 1, "insertOne は 1 度だけ呼び出される");
  assert.strictEqual(status, 500, "ステータスコードは 500");
  assert.strictEqual(message, "Internal Server Error", "レスポンスメッセージは Internal Server Error");
});
