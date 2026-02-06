import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";


describe("Auth e2e", () => {
  let app: INestApplication;
  let token: string;

  const username = `test_e2e_${Date.now()}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /auth/register", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        username,
        password: "123456",
        fullName: "E2E User"
      })
      .expect(201);

    expect(res.body.username).toBe(username);
  });

  it("POST /auth/login", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        username,
        password: "123456"
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    token = res.body.accessToken;
  });

  it("GET /auth/me", async () => {
    const res = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.sub).toBeDefined();
  });

  it("GET /auth/me without token → 401", async () => {
    await request(app.getHttpServer())
      .get("/auth/me")
      .expect(401);
  });
});