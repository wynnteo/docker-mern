db.createUser({
    user: "dbadmin",
    pwd: "P1ssw0rd",
    roles: [
      {
        role: "readWrite",
        db: "docker-mern-mongo",
      },
    ],
});
