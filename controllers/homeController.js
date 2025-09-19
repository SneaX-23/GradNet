import { Home } from "../models/Home.js"
import { User } from "../models/User.js";

export class HomeController {
    static async renderHome(req, res){
        const result = await Home.getFeed();
        try {
            const result = await Home.getFeed();
            res.render("home.ejs", { events: result.rows, user: req.session.user, role: req.session.user.role});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading the feed.");
        }
    }

    
}