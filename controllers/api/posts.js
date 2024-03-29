const express = require('express');
const { Post } = require('../../models'); // Adjust the path as necessary
const isAuthenticated = require('../../middleware/isAuthenticated'); // Path to your authentication middleware
const router = express.Router();

// Create a new post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.session.userId 
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Error creating post", error: error.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
});

// Get a single post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
});

// Update a post
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const updated = await Post.update(req.body, {
      where: { id: req.params.id, userId: req.session.userId }
    });
    if (updated[0] > 0) {
      res.send('Post updated successfully');
    } else {
      res.status(404).send('Post not found or user not authorized');
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
});

// Delete a post
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: { id: req.params.id, userId: req.session.userId }
    });
    if (deleted) {
      res.send('Post deleted successfully');
    } else {
      res.status(404).send('Post not found or user not authorized');
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
});

module.exports = router;
