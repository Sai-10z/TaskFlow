import test from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import generateToken from "./generateToken.js";

test("generateToken returns a valid JWT token signed with JWT_SECRET", () => {
  process.env.JWT_SECRET = "test_secret_key";
  const userId = 123;
  const token = generateToken(userId);

  assert.ok(token, "Token should be defined");
  
  const decoded = jwt.verify(token, "test_secret_key");
  assert.strictEqual(decoded.id, userId, "Decoded token ID should match inputs");
});
