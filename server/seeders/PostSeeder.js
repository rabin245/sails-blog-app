// seeders/PostSeeder.js
module.exports = async function seedPosts() {
  try {
    const late = await User.findOne({ email: "late6002@gmail.com" });
    const late2 = await User.findOne({ email: "late6002.2@gmail.com" });
    const iush = await User.findOne({ email: "aayussraut.ar@gmail.com" });

    const posts = [
      {
        title: "First Post",
        content: "This is the content of the first post.",
        author: late.id,
      },
      {
        title: "Second Post",
        content: "Another post by Late.",
        author: late.id,
      },
      {
        title: "Third Post",
        content: "Late2's first post.",
        author: late2.id,
      },
      {
        title: "Fourth Post",
        content: "Late2's first post.",
        author: late2.id,
      },
    ];

    for (const post of posts) {
      await Post.create(post);
    }
    console.log("Posts seeded successfully!");
  } catch (err) {
    console.error("Error seeding posts:", err);
  }
};
