const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const { v4: uuidv4 } = require('uuid');

const { HttpError, sendEmail } = require("../helpers");
const { ctrlWrapper } = require("../utils");
const { User } = require('../models/user');

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const result = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    }

    await sendEmail(verificationEmail);

    res.status(201).json({
        email: result.email,
        subscription: result.subscription,
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    
    res.json({ message: "Verification successful" });
}

const resend = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
    }

    await sendEmail(verificationEmail);

    res.json({"message": "Verification email sent"});
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Wrong email or password");
    }

    if (!user.verify) {
        throw HttpError(401, "Email is not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Wrong email or password");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, { token })
    res.json(token);
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({email, subscription})
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatar = await jimp.read(resultUpload);
    avatar.resize(250, 250);
    avatar.write(resultUpload);
    const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
}

module.exports = {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resend: ctrlWrapper(resend),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}