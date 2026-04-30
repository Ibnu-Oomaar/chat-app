import type { NextFunction } from "express";
import Jwt from "jsonwebtoken";

/*
========================================
GENERATE TOKEN (UPDATED)
========================================
*/

export const generateToken = (payload: object) => {
    const Access_Token_Secret = process.env.Access_Token_Secret;

    const token = Jwt.sign(payload, Access_Token_Secret as string, { expiresIn: "5m" });
    return token;
};

/*
========================================
VERIFY TOKEN (FIXED TYPE SAFETY)
========================================
*/

export const verifyToken = (token: string) => {
    const Access_Token_Secret = process.env.Access_Token_Secret;

    const decoded = Jwt.verify(token, Access_Token_Secret as string);

    if (!decoded || typeof decoded === "string") {
        throw new Error("your access token is ended, please login again");
    }

    return decoded as {
        id: string;
        email: string;
        role: "user" | "admin";
    };
};

/*
========================================
REFRESH TOKEN
========================================
*/

export const refreshToken = (payload: object) => {
    const Refresh_Token_Secret = process.env.Refresh_Token_Secret;

    const token = Jwt.sign(payload, Refresh_Token_Secret as string, { expiresIn: "30d" });

    if (!token) {
        throw new Error("your refresh token is ended, please login again");
    }

    return token;
};

/*
========================================
STORE / DELETE REFRESH TOKEN (COOKIE)
========================================
*/

export const storeRefreshToken = (res: any, token: string) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export const deleteRefreshToken = (res: any) => {
    res.clearCookie("refreshToken");
};

/*
========================================
LOCAL STORAGE (FRONTEND ONLY)
========================================
*/

export const storeAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
};

export const deleteAccessToken = () => {
    localStorage.removeItem("accessToken");
};

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

/*
========================================
GET REFRESH TOKEN
========================================
*/

export const getRefreshToken = (req: any) => {
    return req.cookies.refreshToken;
};

/*
========================================
LOGOUT USER
========================================
*/

export const logoutUser = (res: any) => {
    deleteAccessToken();
    deleteRefreshToken(res);
};
