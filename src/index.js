// muuttujat
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const mongoose = require("mongoose")
require('dotenv').config() //lisätty dotenv monogdb tietojen salaamiseen
const connect = mongoose.connect(process.env.MONGODB_URL)


app.use(express.json());
app.use(express.urlencoded({extended: false}));
// staattinen tiedosto, täältä löytyy css muotoilut.
app.use(express.static("public"))

app.set('view engine', 'ejs')


// kokeillaan yhteys tietokantaan
connect.then(() => {
    console.log("Tietokanta yhdistetty")
})
.catch(() => {
    console.log("Virhe tietokantaan yhdistäessä")
})

// login scheema
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

// login model
const collection = new mongoose.model("users", loginSchema);

module.exports = collection;


// määritetään juurireitti, joka renderöi login.ejs -sivun
app.get('/', (req, res) => {
    res.render('login.ejs', { query: req.query });
})

// määritetään /signup reitti, joka renderöi signup.ejs -sivun
app.get('/signup', (req, res) => {
    res.render('signup.ejs', { query: req.query });
});

// käytetään express-session -moduulia istuntojen hallintaan
app.use(session({
    secret: 'salainenavain', // erittäin salainen avain
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }
}));

// middleware tarkistamaan, onko käyttäjä kirjautunut sisään
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/');
    }
};

// määritetään /home reitti, joka vaatii kirjautumisen ja renderöi home.ejs -sivun
app.get('/home', (req, res) => {
    if (req.session && req.session.username) {
        res.render('home.ejs', { username: req.session.username });
    } else {
        // jos ei ole kirjautunut sisään:
        res.redirect('/');
    }
});

// käyttäjän rekisteröinti
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // tarkistetaan, onko käyttäjä olemassa
    const existingUser = await collection.findOne({name: data.name})
    if(existingUser) {
        return res.redirect('/signup?error=Käyttäjänimi+on+jo+olemassa');
    } else {
        // hashataan salasana
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/?signup=success');
    }
});

// kirjautuminen
app.post("/login", async (req, res) => {
    try {
        // etsitään löytyykö nimeä tietokannasta
        const check = await collection.findOne({ name: req.body.username });
        // jos on erisuurikuin check niin annetaan error
        if (!check) {
            return res.redirect('/?error=Käyttäjänimi+tai+salasana+on+väärä');
        }
        // tarkistetaan onko salasana täsmäävä.
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        // jos match, siirretään etusivulle.
        if (isPasswordMatch) {
            req.session.userId = check._id;
            req.session.username = check.name;
            res.redirect('/home');
        } else {
            return res.redirect('/?error=Käyttäjänimi+tai+salasana+on+väärä');
        }
    // jos jotain erikoista tapahtuu, niin annetaan siitä myös virhe
    } catch (error) {
        console.error("Virhe kirjautumisen aikana:", error);
        return res.status(500).send("Sisäinen palvelinvirhe");
    }
});

// uloskirjautuminen
app.get('/logout', (req, res) => {
    if (req.session) {
        // tuhotaan istunto ja tyhjennetään käyttäjän eväste
        req.session.destroy((err) => {
            if (err) {
                console.error("Virhe istunnon tuhoamisessa:", err);
                return res.status(500).send("Uloskirjautuminen ei onnistu");
            }
            // heitetään takaisin login-sivulle.
            res.redirect('/');
        });
    } else {
        // jos ei ole istuntoa, ohjaa takaisin kirjautumissivulle
        res.redirect('/');
    }
});

// asetetaan palvelimen portti ja kuunnellaan sitä
const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.error('Virhe palvelimen käynnistämisessä:', err);
    } else {
        console.log('Palvelin päällä portissa:', port);
    }
});