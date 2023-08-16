const { verifyAccessToken } = require("../utils/jwt");

export const authMiddleware = async (req: any, res: any, next: any) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = await verifyAccessToken(token);

      if (!token || !decoded || !decoded.id) {
        return res.status(401).send({ message: "You are not authorized" });
      }

      req.userId = decoded.id;

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({ message: "You are not authorized" });
    }
  }
};
