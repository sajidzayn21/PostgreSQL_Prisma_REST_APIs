import prisma from "../DB/db.config.js";

// * Fetch Users
export const fetchUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        _count: {
          select: {
            post: true,
            comment: true,
          },    
        },
      },

      // include: {
      //   post : true
      // }

      // include : {
      //   post :{
      //     select : {
      //       title : true,
      //       comment_count : true
      //     }
      //   }
      // }


    });

    return res.json({ status: 200, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser) {
      return res.status(400).json({
        status: 400,
        message: "Email already taken. Please use another email.",
      });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password },
    });

    return res.json({ status: 200, data: newUser, msg: "User created." });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Show user
export const showUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    return res.json({ status: 200, data: user });
  } catch (error) {
    console.error("Error showing user:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { name:name, email:email, password:password },
    });

    return res.json({ status: 200, data: updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      // Prisma "Record not found" error
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// * Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    return res.json({ status: 200, msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
