const auth = require("../config/auth");

const getAuthHeaders = (req) => {
  const headers = new Headers();

  Object.entries(req.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((headerValue) => headers.append(key, headerValue));
      return;
    }

    if (value) {
      headers.set(key, value);
    }
  });

  return headers;
};

const authSession = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: getAuthHeaders(req),
    });

    if (!session?.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    req.user = {
      _id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      photoURL: session.user.image || "",
    };

    next();
  } catch (error) {
    console.error("Auth session middleware error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error in authentication" });
  }
};

module.exports = authSession;
