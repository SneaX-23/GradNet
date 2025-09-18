import { AuthService } from "../services/authService.js";

export class AuthController {
    static renderLogin(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    }

    // static renderHome(req, res) {
    //     console.log("At home page");
    //     res.render("home.ejs");
    // }

    static async initiateAuth(req, res) {
        try {
            const { usn } = req.body;
            
            if (!usn) {
                return res.status(400).render("error.ejs", { 
                    message: "USN is required" 
                });
            }

            const result = await AuthService.initiateLogin(usn);
            
          
            req.session.email = result.email;
            req.session.otpSent = true;
            
            res.render("login.ejs", { 
                mail: result.email,
                message: "OTP has been sent to your email"
            });

        } catch (error) {
            console.error('Auth initiation error:', error);
            res.status(400).render("error.ejs", { 
                message: error.message || "Authentication failed. Please try again." 
            });
        }
    }

    static async verifyOTP(req, res) {
        try {
            const { otp } = req.body;
            const email = req.session.email;

            if (!email || !req.session.otpSent) {
                return res.redirect("/");
            }

            if (!otp) {
                return res.render("login.ejs", { 
                    mail: email, 
                    error: "OTP is required" 
                });
            }

            const result = await AuthService.verifyOTP(email, otp);
            
            
            delete req.session.email;
            delete req.session.otpSent;
           
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role
            };

            res.redirect("/home");

        } catch (error) {
            console.error('OTP verification error:', error);
            const email = req.session.email;
            res.render("login.ejs", { 
                mail: email, 
                error: error.message || "Invalid OTP. Please try again." 
            });
        }
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).render("error.ejs", { 
                    message: "Logout failed" 
                });
            }
            res.redirect("/");
        });
    }
}