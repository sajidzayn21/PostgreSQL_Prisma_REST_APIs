import prisma from "../DB/db.config.js";

// * Fetch Post
export const fetchPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
        include : {
            comment : {
                include : {
                    user : {
                        select : {
                            name : true,
                        }
                    }
                }
            }
        },
        where : {
            OR : [
                {
                    title : {
                        startsWith : "hey"
                    }
                },
                {
                    title : {
                        endsWith : "abcd"
                    }
                }
            ]
        },
        orderBy: {
          id: "desc",
        },
        // where : {
        //     comment_count : {
        //         gt : 0
        //     }
        // }
    });

    //   * to get the total posts count
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.json({ status: 200, data: posts, meta : {
        totalPosts,
        totalPages,
        currentPage : page,
        limitPerPage : limit
    } });
  } 
  catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Create Post
export const createPost = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;

    const newPost = await prisma.post.create({
        data: {
            user_id : Number(user_id),
            title,
            description
        }
    });

    return res.json({ status: 200, data: newPost, msg: "Post created." });
  } 
  catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Show post
export const showPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findFirst({
      where: { id: Number(postId) },
    });

    if (!post) {
      return res.status(404).json({ status: 404, message: "Post not found" });
    }

    return res.json({ status: 200, data: post });
  } 
  catch (error) {
    console.error("Error showing post:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Update post
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { user_id, title , description} = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: { 
        user_id: Number(user_id),
        title,
        description
       },
    });

    return res.json({ status: 200, data: updatedPost, message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);

    if (error.code === "P2025") {
      // Prisma "Record not found" error
      return res.status(404).json({ status: 404, message: "Post not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    return res.json({ status: 200, msg: "Post deleted successfully" });
  } 
  catch (error) {
    console.error("Error deleting post:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ status: 404, message: "Post not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// search post
export const searchPost = async (req, res) => {
  try {
    const { q } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        description : {
          search : q // use 'contains' for small length match as it's TC is high, 'search' for full-text search as TC is small
        }
      },
    });

    return res.json({ status: 200, data: posts });
  } 
  catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
