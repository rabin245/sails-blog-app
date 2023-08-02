// seeders/PostSeeder.js
module.exports = async function seedPosts() {
  try {
    const late = await User.findOne({ email: "late6002@gmail.com" });
    const late2 = await User.findOne({ email: "late6002.2@gmail.com" });
    const iush = await User.findOne({ email: "aayussraut.ar@gmail.com" });

    const posts = [
      {
        title: "First Post",
        content: `{"blocks":[{"key":"6ubg","text":"Hello,I am unnder the water ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":6,"style":"color-rgb(255,255,255)"},{"offset":0,"length":6,"style":"bgcolor-rgb(0,0,0)"},{"offset":0,"length":6,"style":"fontsize-medium"},{"offset":0,"length":6,"style":"fontfamily-Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"},{"offset":0,"length":5,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        author: late.id,
      },
      {
        title: "Second Post",
        content: `{"blocks":[{"key":"6tdag","text":"THis is a test blog","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        author: late.id,
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
