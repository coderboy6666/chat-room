import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const jwtToken = jwt.sign({ userId }, process.env.private_pass, {
        expiresIn: "7d",
    });
    res.cookie("jwt", jwtToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return jwtToken;
}
