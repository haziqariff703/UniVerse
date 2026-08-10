import { createRequire } from "node:module";
import { afterEach, describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const { auth, authorize } = require("./auth");

const originalJwtSecret = process.env.JWT_SECRET;

const createResponse = () => {
  const response = {};
  response.status = vi.fn(() => response);
  response.json = vi.fn(() => response);
  return response;
};

afterEach(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

describe("auth", () => {
  it("rejects requests without a bearer token", () => {
    const req = { header: vi.fn(() => undefined) };
    const res = createResponse();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid tokens", () => {
    process.env.JWT_SECRET = "ci-test-secret";
    const req = { header: vi.fn(() => "Bearer invalid-token") };
    const res = createResponse();
    const next = vi.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches decoded user data for a valid token", () => {
    process.env.JWT_SECRET = "ci-test-secret";
    const token = jwt.sign(
      { id: "user-1", roles: ["student"] },
      process.env.JWT_SECRET,
    );
    const req = { header: vi.fn(() => `Bearer ${token}`) };
    const res = createResponse();
    const next = vi.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject({ id: "user-1", roles: ["student"] });
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("authorize", () => {
  it("allows a user with one of the required roles", async () => {
    const req = { user: { roles: ["organizer"] } };
    const res = createResponse();
    const next = vi.fn();

    await authorize("admin", "organizer")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects a user without a required role", async () => {
    const req = { user: { roles: ["student"] } };
    const res = createResponse();
    const next = vi.fn();

    await authorize("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. Required role: admin.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
