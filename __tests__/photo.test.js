const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { Photo } = require("../models");

// const dataUser = {
//     username: "admin",
//     email: "admin@mail.com",
//     password: "1234",
// };

// const dataPhoto = {
//     title: "test title",
//     caption: "test caption",
//     image_url: "https://goggle.com",
// };

//test untuk API create photo
describe("POST /photos", () => {
  beforeAll(async () => {
    try {
      await User.create({
        username: "admin",
        email: "admin@mail.com",
        password: "1234",
      });
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  it("should send response with 201", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send({
        email: "admin@mail.com",
        password: "1234",
      })
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const token = res.body.token;
        request(app)
          .post("/photos")
          .set("authorization", token)
          .send({
            title: "test title",
            caption: "test caption",
            image_url: "https://goggle.com",
          })
          //execute
          .expect(201)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("caption");
            expect(res.body).toHaveProperty("image_url");
            expect(res.body.title).toEqual("test title");
            expect(res.body.caption).toEqual("test caption");
            expect(res.body.image_url).toEqual("https://goggle.com");
            done();
          });
      });
  });

  it("should send response with 401", (done) => {
    //setup
    request(app)
      .post("/photos")
      .send({
        title: "test title",
        caption: "test caption",
        image_url: "https://goggle.com",
      })
      //execute
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        done();
      });
  });
});

//test untuk API get all photos
describe("GET /photos", () => {
  beforeAll(async () => {
    try {
      const result = await User.create({
        username: "admin",
        email: "admin@mail.com",
        password: "1234",
      });
      const photo = await Photo.create({
        title: "test title",
        caption: "test caption",
        image_url: "https://goggle.com",
        UserId: result.id,
      });
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });
  
  it("should send response with 200", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send({
        email: "admin@mail.com",
        password: "1234",
      })
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const token = res.body.token;
        request(app)
          .get("/photos")
          .set("authorization", token)
          //execute
          .expect(200)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  caption: expect.any(String),
                  image_url: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  UserId: expect.any(Number),
                }),
              ])
            );
            done();
          });
      });
  });

  it("should send response with 401", (done) => {
    //setup
    request(app)
      .get("/photos")
      //execute
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        done();
      });
  });
});

//test untuk API get photo by ID
describe("GET /photos/:id", () => {
  beforeAll(async () => {
    try {
      const result = await User.create({
        id: 1,
        username: "admin",
        email: "admin@mail.com",
        password: "1234",
      });
      const photo = await Photo.create({
        id: 1,
        title: "test title",
        caption: "test caption",
        image_url: "https://goggle.com",
        UserId: result.id,
      });
    } catch (error) {
      console.log(error);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  it("should send response with 200", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send({
        email: "admin@mail.com",
        password: "1234",
      })
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const token = res.body.token;
        request(app)
          .get("/photos/1")
          .set("authorization", token)
          //execute
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                caption: expect.any(String),
                image_url: expect.any(String),
                UserId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              })
            );
            done();
          });
      });
  });

  it("should send response with 401", (done) => {
    //setup
    request(app)
      .get("/photos/1")
      //execute
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        done();
      });
  });
});
