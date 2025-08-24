import prisma from "../DB/db.config.js";

// * Fetch comments
export const fetchComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
        include : {
            user : true,
            post : {
                include : {
                    user : true
                }
            }
        }

    });

    return res.json({ status: 200, data: comments });
  } 
  catch (error) {
    console.error("Error fetching comments :", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Create Comment
export const createComment = async (req, res) => {
  try {
    const { user_id, post_id, comment } = req.body;

    //increasse comment count in post table
    await prisma.post.update({
        where : { id : Number(post_id)},
        data : {
            comment_count : {
                increment : 1
            }
        }
    })

    const newComment = await prisma.comment.create({
        data: {
            user_id : Number(user_id),
            post_id : Number(post_id),
            comment
        }
    });

    return res.json({ status: 200, data: newComment, msg: "Comment created." });
  } 
  catch (error) {
    console.error("Error creating comment :", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Show comment
export const showComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await prisma.comment.findFirst({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ status: 404, message: "comment not found" });
    }

    return res.json({ status: 200, data: comment });
  } 
  catch (error) {
    console.error("Error showing comment :", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Update comment
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { user_id,post_id, comment} = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { 
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment
       },
    });

    return res.json({ status: 200, data: updatedComment, message: "comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);

    if (error.code === "P2025") {
      // Prisma "Record not found" error
      return res.status(404).json({ status: 404, message: "comment not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Delete post
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { post_id } = req.body;

    //decrease comment count in post table
    await prisma.post.update({
        where : { id : Number(post_id)},
        data : {
            comment_count : {
                decrement : 1
            }
        }
    })

    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    return res.json({ status: 200, msg: "comment deleted successfully" });
  } 
  catch (error) {
    console.error("Error deleting comment:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ status: 404, message: "comment not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
