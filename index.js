import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));

let posts = [
    {
        id: uuidv4(),
        username: "dev",
        content: "First post"
    },
    {
        id: uuidv4(),
        username: "demo",
        content: "Demo Post"
    },
    {
        id: uuidv4(),
        username: "learning",
        content: "Learning  REST API"
    }
]
app.listen(port, () => {
    console.log(`server is running at port: ${port}`);
});

app.get("/posts", (req,res) => {
    res.render("index.ejs", { posts })
});

app.post("/posts", (req,res) => {
    let { username,content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect('/posts');
});

app.get("/posts/new", (req,res) => {
    res.render("new.ejs");
});

app.get("/posts/:id", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    // res.send("Server working");
    res.render("show.ejs", { post })
});

app.get("/posts/:id/edit", (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post })
});
app.patch("/posts/:id", (req,res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    res.redirect("/posts")
});

app.delete("/posts/:id", (req,res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts")
});