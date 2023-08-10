module.exports = async function seedUsers() {
  const users = [
    {
      fullName: "Late 6002",
      email: "late6002@gmail.com",
      password: "password123",
      emailStatus: "confirmed",
    },
    {
      fullName: "Late 6002 Second",
      email: "late6002.2@gmail.com",
      password: "password123",
      emailStatus: "confirmed",
    },
    {
      fullName: "Aayush",
      email: "aayussraut.ar@gmail.com",
      password: "password123",
      emailStatus: "confirmed",
    },
  ];

  try {
    for (const user of users) {
      await User.create(user);
    }
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};
