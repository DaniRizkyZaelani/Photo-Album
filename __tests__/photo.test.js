const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { Photo } = require("../models");

const dataUser = {
  id: 1,
  username: "admin",
  email: "admin@mail.com",
  password: "1234",
};

const dataPhoto = {
  id: 1,
  title: "Photo 1",
  caption: "Caption photo 1",
  image_url: "https://picsum.photos/id/1/200/300",
  UserId: 1,
};

//test untuk API create photo
describe("POST /photos", () => {
  beforeAll(async () => {
    try {
      await User.create(dataUser);
    } catch (err) {
      console.log(err);
    }
  });
  it("should send response with 201", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send(dataUser)
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const token = res.body.token;
        request(app)
          .post("/photos")
          .set("authorization", token)
          .send(dataPhoto)
          //execute
          .expect(201)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("caption");
            expect(res.body).toHaveProperty("image_url");
            expect(res.body.title).toEqual("Photo 1");
            expect(res.body.caption).toEqual("Caption photo 1");
            expect(res.body.image_url).toEqual(
              "https://picsum.photos/id/1/200/300"
            );
            done();
          });
      });
  });

  it("should send response with 401", (done) => {
    //setup
    request(app)
      .post("/photos")
      .send(dataPhoto)
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
      await User.create(dataUser);
      await Photo.create(dataPhoto);
    } catch (err) {
      console.log(err);
    }
  });
  it("should send response with 200", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send(dataUser)
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
      await User.create(dataUser);
      await Photo.create(dataPhoto);
    } catch (error) {
      console.log(error);
    }
  });

  it("should send response with 200", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send(dataUser)
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

  //   afterAll(async () => {
  //     try {
  //       await User.destroy({ where: {} });
  //       await Photo.destroy({ where: {} });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
});
