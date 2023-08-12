const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

let jwtToken;
let adminJwtToken;

describe("Authentication", () => {
  it("should successfully authenticate with valid credentials", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({ email: "hello@hotmail.com", password: "12345fdfg678" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should fail authentication with invalid credentials", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({ email: "test@test.com", password: "wrongpassword" })
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
});

describe("JWT", () => {
  it("should generate a valid JWT token upon successful login", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({ email: "hello@hotmail.com", password: "12345fdfg678" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("token");
        jwtToken = res.body.token;
        done();
      });
  });

  it("should validate a JWT token and provide access", (done) => {
    chai
      .request(server)
      .get("/api/profile")
      .set("Authorization", jwtToken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("Role Access", () => {
  it("admin login successfully.", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({ email: "admin@hotmail.com", password: "87654321" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("token");
        adminJwtToken = res.body.token;
        done();
      });
  });

  it("should allow admin users access to admin route", (done) => {
    chai
      .request(server)
      .get("/api/admin")
      .set("Authorization", adminJwtToken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should prevent non-admin users from accessing the admin route", (done) => {
    chai
      .request(server)
      .get("/api/admin")
      .set("Authorization", jwtToken)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
});

describe("Rate Limiting", () => {
  it("should limit login attempts after 8 tries", async () => {
    for (let i = 4; i < 9; i++) {
      const res = await chai
        .request(server)
        .post("/api/login")
        .send({ email: "test@test.com", password: "wrongpassword" });

      if (i <= 7) {
        expect(res).to.not.have.status(429);
      } else {
        expect(res).to.have.status(429);
      }
    }
  });
});
