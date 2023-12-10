# Fullstack harjoitustyö kurssille Full Stack -ohjelmointi TTC2080-3025

Harjoitustyön aiheena oli fullstack forum-palvelu, jossa on suojattu kirjautuminen. Salasanojen suojaamiseen on käytetty bcrypt-kirjastoa, jolla hashataan salasanat turvalliseen muotoon tietokantaan. Express-session mahdollistaa istuntojen hallinnan ja tällä pystytään seuraamaan käyttäjän tilaa. Virheenkäsittely mahdollistaa helppokäyttöisen kokemuksen käyttäjälle tunnusta luodessa ja kirjautuessa.

## Backendissä käytetyt tekniikat:

> Express: Web-sovelluskehyksenä käytetään Expressiä. Se tarjoaa helpon tavan käsitellä HTTP-pyyntöjä ja määrittää reitityksiä.

> Bcrypt: Sovellus käyttää bcrypt-kirjastoa salasanojen turvalliseen hashaukseen ja tarkistukseen.

> Express-session: Istuntojen hallintaan käytetään express-session -moduulia Tämä mahdollistaa käyttäjän tilan seurannan.

> MongoDB ja Mongoose: Tietokantana käytetään MongoDB:tä, ja yhteys siihen otetaan käyttöön mongoose-kirjaston avulla.

> EJS: Näkymien renderöintiin käytetään EJS. Näkymät sijaitsevat views-kansiossa.

> Reitit: Määritellään useita reittejä, kuten juurireitti (/), rekisteröitymisreitti (/signup), kotisivureitti (/home), kirjautumisreitti (/login) ja uloskirjautumisreitti (/logout). Reitit käyttävät erilaisia middlewareja ja istuntojen tarkistuksia.

> Istuntojen hallinta: Käytetään express-session -moduulia istuntojen hallintaan. Istunnon tiedot tallennetaan istunnon aikana muuttujiin, kuten req.session.userId ja req.session.username.

> Virheenkäsittely: Yksinkertaiset try/catch rakenteet virheenkäsittelyyn.
