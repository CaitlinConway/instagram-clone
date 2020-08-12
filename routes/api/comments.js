const express = require("express");
const router = express.Router();
const db = require("../../db/models");
const { routeHandler } = require("../utils");
const { User, Relationship, Comment, Like, Picture, Status } = db;
router.post(
  "/",
  routeHandler(async (req, res, next) => {
    console.log("body req", req.body);
    const { content, pictureId } = req.body;
    const userId = await parseInt(req.cookies.user);
    const comment = await Comment.create({
      content,
      userId,
      pictureId,
    });
    res.json({ comment });
  })
);
router.get(
  "/",
  routeHandler(async (req, res, next) => {
    const pictures = await Picture.findAll({
      include: { model: User, model: Comment },
    });
    const user = await User.findOne({
      where: {
        id: await parseInt(req.cookies.user),
      },
    });
    const picIds = [];
    pictures.forEach((picture) => picIds.push(picture.id));
    const comments = await Comment.findAll({
      where: {
        pictureId: picIds,
      },
      include: {
        model: User,
      },
    });
    res.json({
      pictures,
      user,
      comments,
    });
  })
);
router.get(
  "/:id(\\d+)",
  routeHandler(async (req, res, next) => {
    const pictureId = parseInt(req.params.id, 10);
    const picture = await Picture.findByPk(pictureId, {
      include: { model: User, model: Comment },
    });
    const comments = await Comment.findAll({
      where: {
        pictureId,
      },
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    res.json({
      picture,
      comments,
    });
  })
);
module.exports = router;
