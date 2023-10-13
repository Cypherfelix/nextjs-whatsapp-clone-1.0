import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, user: user });
    }
  } catch (err) {
    next(err);
  }
};

export const onboardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      return res.json({
        msg: "Email, Name and profile are required",
        status: false,
      });
    }

    const prisma = getPrismaInstance();

    //check if user already exists

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.json({
        msg: "User already exists",
        status: true,
        user: userExists,
      });
    }

    const user = await prisma.user.create({
      user: {
        email,
        name,
        about,
        profilePicture,
      },
    });

    if (!user) {
      return res.json({ msg: "User not created", status: false });
    } else {
      return res.json({ msg: "success", status: true, user: user });
    }
  } catch (error) {
    next(error);
  }
};
