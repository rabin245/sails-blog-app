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
        author: late2.id,
      },
      {
        title: "Stop Using try-catch to Catch Async/Await Exceptions",
        content: `{
          "blocks": [
            {
              "text": "First of all, let me explain that there is nothing wrong with try-catch processing. I think writing the code this way will be a bit messy. I feel that the logic of the code is broken and difficult to understand.",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "The second is the problem of code redundancy. A single try-catch takes up several lines of code. If a try-catch is added to each request, the code will appear bloated.",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "And for such a large number of identical redundant codes, it can be replaced by a general function. async/await was introduced in ES2017 to make asynchronous operations more intuitive and convenient and solve the Promise callback hell problem.",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "1. When will an exception be requested",
              "type": "header-one",
              "depth": 0
            },
            {
              "text": "We all know that await is usually followed by asynchronous requests. The reasons for abnormalities in asynchronous requests are roughly as follows:",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "Due to network problems, the network is disconnected and the request is not available",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "A slow network causes asynchronous requests to time out.",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "2. Under what circumstances do you need to handle request exceptions?",
              "type": "header-one",
              "depth": 0
            },
            {
              "text": "Once the above situation occurs, the asynchronous request will generate an exception, and JavaScript is a single-threaded language. After the code reports an error, the subsequent code cannot continue to execute, so it is necessary to add a try-catch to capture the asynchronous request at this time. Exception, so that the code can continue to execute backward.",
              "type": "unstyled",
              "depth": 0
            },
            {
              "text": "But is it necessary to add a try-catch for all asynchronous requests?",
              "type": "unstyled",
              "depth": 0
            }
          ],
          "entityMap": {}
        }
        `,
        author: iush.id,
      },
    ];

    for (const post of posts) {
      const createdPost = await Post.create(post).fetch();

      // await Post.addToCollection(createdPost.id, "likers", [late.id, late2.id]);
      await Post.addToCollection(createdPost.id, "likers", late.id);

      await Comment.create({
        post: createdPost.id,
        content: "Great post!",
        user: late.id,
      });

      await Comment.create({
        post: createdPost.id,
        content: "I enjoyed reading this.",
        user: late2.id,
      });
    }
  } catch (err) {
    console.error("Error seeding posts:", err);
  }
};
