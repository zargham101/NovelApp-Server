const express = require('express');
const userModel = require('../../Models/userSchema');
const blogsModel = require('../../Models/novelSchema');
const uploads = require('../../middlewares/multer');

const commentModel = require('../../Models/commentSchema');
const router = express.Router();


router.get('/', async (req, res) => {
    const blogs = await blogsModel.find().populate('comments').populate({ path: 'user', select: ('name') });
    res.send(blogs);
})

router.get('/description/:id', async (req, res) => {
    const blogs = await blogsModel.find({ _id: req.params.id });

    res.send(blogs);
})

router.get('/:id', async (req, res) => {
    const blog = await blogsModel.findById(req.params.id);
    res.send(blog);
})


router.get('/MyNovels/:id', async (req, res) => {
    const blogs = await blogsModel.find({ user: req.params.id }).populate('user').select({ password: 0, confirm: 0 })
    res.send(blogs);
})

router.post('/:id', uploads.single('Avatar'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const user = await userModel.findById(req.params.id);
    const blog = new blogsModel();
    blog.user = user;
    blog.author = req.body.author;
    blog.title = req.body.title;
    blog.cover = url + '/Images/' + req.file.filename;
    blog.description = req.body.description;
    await blog.save();
    user.blogs.push(blog);
    await user.save();
    res.json({ message: 'Successfully Registerd' })
})

router.delete('/:id', async (req, res) => {
    const novel = await blogsModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Novel Successfully deleted.' })
})


router.post('/comment/:bId/:uId', async (req, res) => {
    const blog = await blogsModel.findById(req.params.bId);
    const user = await userModel.findById(req.params.uId);
    const comment = new commentModel();
    comment.blog = blog;
    comment.user = user;
    comment.text = req.body.text;
    await comment.save();
    blog.comments.push(comment);
    await blog.save();
    user.comments.push(comment);
    await user.save();
    res.json({ message: 'Comment was successfully made.' });

})

router.put('/:uId/:bId', uploads.single('Avatar'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const user = await userModel.findById(req.params.uId);
    const blog = await blogsModel.findById(req.params.bId);

    if (!req.file) return res.status(403).json({ message: 'Image was missing' });
    user.blogs = blog;
    blog.user = user;
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.description = req.body.description;
    blog.cover = url + '/Images/' + req.file.filename;
    await blog.save();

    user.blogs.push(blog);
    await user.save();
    res.json({ message: 'Successfully Updated' });



})



module.exports = router;